import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles';

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome'])
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const { createTransaction } = useContext(TransactionsContext)

  const { control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema)
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    const { description, price, category, type } = data

    createTransaction({
      description, price, category, type
    })

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            {...register('description')}
            type="text"
            placeholder='Descrição'
            required
          />
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            placeholder='Preço'
            required
          />
          <input
            {...register("category")}
            type="text"
            placeholder='Categoria'
            required
          />

          <Controller control={control} name="type" render={({ field }) => {
            console.log(field);

            return (
              <TransactionType onValueChange={field.onChange} value={field.value}>
                <TransactionTypeButton variant='income' value='income'>
                  <ArrowCircleUp size={24} />
                  Entradas
                </TransactionTypeButton>

                <TransactionTypeButton variant='outcome' value='outcome'>
                  <ArrowCircleDown size={24} />
                  Saídas
                </TransactionTypeButton>
              </TransactionType>
            )
          }} />

          <button type='submit' disabled={isSubmitting}>Cadastrar</button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}