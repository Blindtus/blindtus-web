import { useGenericMutation } from '@/hooks/use-generic-query';
import { AuthUser, AuthUserLogin } from '@/types/auth.type';
import { QueryResponse } from '@/types/query.type';

import { askLogin } from '../api/auth';

export const useLoginAccount = () => {
  return useGenericMutation<AuthUserLogin, QueryResponse<AuthUser>>(askLogin);
};
