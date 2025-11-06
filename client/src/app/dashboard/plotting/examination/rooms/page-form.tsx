import { zodResolver } from '@hookform/resolvers/zod';
import { get, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import usePocketbase from '@/hooks/use-pocketbase';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import type { FinaleExamRoomsRecord } from '@/types/pocketbase';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { formSchema } from './page-form.schema';

export default function FormFinaleExamRooms() {
  const id = useParams().id as string;
  const navigate = useNavigate();
  const { updateRecord, getOneRecord, isLoading, createRecord } =
    usePocketbase('finale_exam_rooms');

  useEffect(() => {
    if (!id) return;
    getOneRecord(id).then(res => {
      form.reset({
        room_name: get(res, 'room_name', ''),
      });
    });
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const record: Partial<FinaleExamRoomsRecord> = {
        room_name: values.room_name,
      };

      if (!id) {
        await createRecord(record);
      } else {
        await updateRecord(id, record);
      }
      navigate(-1);
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error(`Failed to update student. ${error}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-xl">{id ? 'Edit' : 'Create'} Student</h1>
        <FormField
          control={form.control}
          name="room_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name*</FormLabel>
              <FormControl>
                <Input placeholder="Room Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Saving...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}
