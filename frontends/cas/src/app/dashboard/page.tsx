'use client';
import DashboardCard from '@/customComponents/DashboardCard';
import { GET_CARDS_QUERY } from '@/modules/cards/gql';
import { CardsData } from '@/modules/cards/types';
import { useQuery } from '@apollo/client';
import { NextPage } from 'next';

const DashboardPage: NextPage = () => {
  const { data } = useQuery<CardsData>(GET_CARDS_QUERY);
  const cardData = data?.cards ?? [];
  return (
    <div className="grid max-w-screen-2xl grid-cols-1 gap-7 p-4 md:grid-cols-3 md:p-6 2xl:p-10">
      {cardData.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          description={card.description}
          link={card.url}
        />
      ))}
    </div>
  );
};

export default DashboardPage;
