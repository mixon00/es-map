import { Spinner } from "@/components/ui/spinner";


export const Loader = () => {
  return (
    <div className='w-full h-full rounded-lg shadow-lg border flex items-center justify-center'>
      <Spinner className='w-10 h-10 animate-spin' />
    </div>
  );
};