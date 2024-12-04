import { GetStaticPaths, GetStaticProps } from 'next';
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';

const prisma = new PrismaClient();

type UserProps = {
  id: string;
  name: string;
};

export default function UserPage({ id, name }: UserProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Name:</strong> {name}</p>
    </div>
  );
}

// Récupération des chemins statiques (build-time)
export const getStaticPaths: GetStaticPaths = async () => {
  // Récupère les deux premiers utilisateurs uniquement
  const users = await prisma.user.findMany({
    take: 2, // Limite à deux utilisateurs
    select: { id: true },
  });

  const paths = users.map((user) => ({
    params: { id: user.id },
  }));

  return {
    paths, // Générer uniquement ces chemins au moment du build
    fallback: true, // Les autres chemins seront générés dynamiquement
  };
};

// Récupération des données pour chaque chemin dynamique
export const getStaticProps: GetStaticProps<UserProps> = async (context) => {
  const { id } = context.params!;

  // Récupère l'utilisateur correspondant à l'ID
  const user = await prisma.user.findUnique({
    where: { id: String(id) },
  });

  if (!user) {
    return { notFound: true }; // Retourne une 404 si l'utilisateur n'existe pas
  }

  return {
    props: user, // Passe les données utilisateur à la page
    revalidate: 10, // Régénération ISR toutes les 10 secondes
  };
};
