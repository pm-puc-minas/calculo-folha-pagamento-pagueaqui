'use client';

import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { formatError } from '@/app/lib/axios';
import { BadRequestGenericResponseDto } from '@/app/schemas/model';
import { WarningOctagon } from '@phosphor-icons/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

// props
interface DeleteConfirmationModalProps {
  children: React.ReactNode;
  /** título do modal. Ex: "Excluir Usuário". */
  title: string;
  /** nome do item a ser excluido. Ex: "Usuário". */
  item: string;
  /** nome específico do item a ser excluído. Ex: "João da Silva". */
  itemName: string;
  /** função que efetivamente chama a API para deletar. Deve retornar uma Promise. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteFn: () => Promise<any>;
  /** chave da query do React Query que deve ser invalidada após o sucesso. Ex: ['users']. */
  queryKey: string[];
  /** mensagem de sucesso customizada. */
  successMessage?: string;
  /** mensagem de erro customizada. */
  errorMessage?: string;
}

export const DeleteConfirmationModal = ({
  children,
  title,
  item,
  itemName,
  deleteFn,
  queryKey,
  successMessage = 'Item excluído com sucesso',
  errorMessage = 'Erro ao excluir item',
}: DeleteConfirmationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['delete-item', itemName],
    mutationFn: deleteFn,
    onSuccess: () => {
      toast.success(successMessage);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(formatError(error as AxiosError<BadRequestGenericResponseDto>, errorMessage));
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-2">
        <DialogHeader>
          <DialogTitle>
            <WarningOctagon className="mr-2 inline-block size-[1.125rem] text-[#E03131]" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogMain>
          <p className="w-full text-wrap text-sm font-normal text-[#25262B]">
            Você está prestes a excluir {item} <strong className="font-bold">{itemName}</strong>.
            Essa ação é permanente e não poderá ser desfeita. Tem certeza de que deseja continuar?
          </p>
        </DialogMain>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" isLoading={isPending} className="w-fit">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            isLoading={isPending}
            onClick={() => mutate()}
            className="w-fit">
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
