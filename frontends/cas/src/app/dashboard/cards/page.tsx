'use client';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import { Table } from '@/customComponents/Table';

import { Column } from '@/customComponents/types';
import useDialog from '@/hooks/useDialog';
import {
  CREATE_CARD_MUTATION,
  GET_CARDS_QUERY,
  REMOVE_CARD_MUTATION,
  UPDATE_CARD_MUTATION,
} from '@/modules/cards/gql';
import { CardFormInputs, cardSchema } from '@/modules/cards/schemas';
import { Card, CardFormProps, CardsData } from '@/modules/cards/types';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Trash } from 'lucide-react';
import { NextPage } from 'next';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const columns: Column<Card>[] = [
  { header: 'Title', accessor: 'title' },
  { header: 'Description', accessor: 'description' },
  {
    header: 'Url',
    accessor: 'url',
    format: (value: string) => (
      <a href={value} target="_blank">
        {value}
      </a>
    ),
  },
];

const CardsPage: NextPage = () => {
  const { data, refetch } = useQuery<CardsData>(GET_CARDS_QUERY);
  const { openDialog, clearDialog } = useDialog();
  const initialvalues = {
    title: '',
    url: '',
    description: '',
  };

  const onClickSubmit = () => {
    clearDialog();
    refetch();
  };

  const onClickAddCard = () => {
    openDialog({
      title: 'Add Card',
      content: (
        <CardForm values={initialvalues} onClickSubmit={onClickSubmit} />
      ),
    });
  };

  const onClickEdit = (card: CardFormInputs) => {
    openDialog({
      title: 'Edit Card',
      content: <CardForm values={card} onClickSubmit={onClickSubmit} />,
    });
  };

  const onClickDelete = (card: CardFormInputs) => {
    openDialog({
      title: 'Delete Card',
      content: <DeleteCardForm values={card} onClickSubmit={onClickSubmit} />,
    });
  };

  const actions = [
    {
      label: 'Edit',
      onClick: onClickEdit,
      icon: <Edit className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Delete',
      onClick: onClickDelete,
      icon: <Trash className="h-4 w-4 text-destructive" />,
    },
  ];
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Card List
        </h3>
        <Button className="w-full md:w-auto" onClick={onClickAddCard}>
          Add Card
        </Button>
      </div>
      <Table
        columns={columns}
        data={data?.cards ?? []}
        actions={actions}
        className="my-4"
      />
    </div>
  );
};

export default CardsPage;

const CardForm: FC<CardFormProps> = ({ values, onClickSubmit }) => {
  const [createCard, { loading: addLoading }] =
    useMutation(CREATE_CARD_MUTATION);
  const [updateCard, { loading: editLoading }] =
    useMutation(UPDATE_CARD_MUTATION);

  const isEdit = !!values.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<CardFormInputs>({
    resolver: zodResolver(cardSchema),
    defaultValues: values,
  });

  const onSubmit: SubmitHandler<CardFormInputs> = async (data) => {
    try {
      if (isEdit) {
        await updateCard({
          variables: {
            updateCardInput: data,
          },
        });
      } else {
        await createCard({
          variables: {
            createCardInput: data,
          },
        });
      }
      onClickSubmit?.();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          id="title"
          label="Title *"
          {...register('title')}
          className={
            errors.title
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          id="url"
          label="Url *"
          {...register('url')}
          className={
            errors.url
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.url && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.url.message}
          </p>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          id="description"
          label="Description"
          {...register('description')}
          className={
            errors.description
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.description.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={addLoading || editLoading || !isDirty || !isValid}
      >
        submit
      </Button>
    </form>
  );
};

const DeleteCardForm: FC<CardFormProps> = ({ values, onClickSubmit }) => {
  const [removeCard] = useMutation(REMOVE_CARD_MUTATION);
  const onConfirm = async () => {
    try {
      await removeCard({
        variables: {
          id: values.id,
        },
      });
      onClickSubmit?.();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <p>Are you sure you want to delete this card?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};
