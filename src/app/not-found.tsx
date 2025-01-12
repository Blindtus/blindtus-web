import Link from 'next/link';

import Background from '@/components/Background';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div>
      <Background />
      <Header />
      <div className="pb-12">
        <main className="container">
          <div className="mt-16 justify-between">
            <h1 className="mb-8 text-6xl font-bold text-white">404</h1>
            <p className="mb-4 text-xl text-white">Page non trouvée !</p>
            <p className="text-lg text-white">Désolé, la page que vous recherchez n'existe pas.</p>
            <div className="mt-12">
              <Button asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFoundPage;
