import { useQueryClient } from '@tanstack/react-query';

import { useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';
import { QueryResponse } from '@/types/query.type';
import { NewRoadmap, Roadmap } from '@/types/roadmap.type';

import { askCreateRoadmap, askUpdateRoadmap, getRoadmapList } from '../api/roadmap';
import { QUERY_KEYS } from './queryKeys';

export const useGetRoadmapList = () => useGenericQuery([QUERY_KEYS.ROADMAP_LIST], getRoadmapList);

export const useCreateRoadmap = () => {
  return useGenericMutation<NewRoadmap, QueryResponse<Roadmap>>(
    askCreateRoadmap,
    () => {},
    () => [QUERY_KEYS.ROADMAP_LIST],
  );
};

export const useUpdateRoadmapItem = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<
    {
      roadmapId: string;
      roadmap: Partial<Roadmap>;
    },
    QueryResponse<Roadmap>
  >(
    ({ roadmapId, roadmap }) => askUpdateRoadmap(roadmapId, roadmap),
    (response, { roadmapId }) => {
      const originalData = queryClient.getQueryData<Roadmap>([QUERY_KEYS.ROADMAP_BY_ID, roadmapId]);

      if (originalData) {
        queryClient.setQueryData([QUERY_KEYS.ROADMAP_BY_ID, roadmapId], {
          ...originalData,
          ...response.data,
        });
      }

      const roadmapDatas = queryClient.getQueriesData<QueryResponse<Roadmap[]>>({
        queryKey: [QUERY_KEYS.ROADMAP_LIST],
      });

      roadmapDatas.forEach((roadmapData) => {
        if (!roadmapData) {
          return;
        }

        const datas = roadmapData[1]?.data || [];

        if (!datas) {
          return;
        }

        // update the media in the list
        const updatedRoadmap = datas.map((data) => {
          if (data._id === roadmapId) {
            return {
              ...data,
              ...response.data,
            };
          }

          return data;
        });

        queryClient.setQueryData(roadmapData[0], {
          ...roadmapData[1],
          data: updatedRoadmap,
        });
      });
    },
    () => [],
  );
};
