import { Tooltip as TooltipWrapper, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <TooltipWrapper>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{content}</p>
      </TooltipContent>
    </TooltipWrapper>
  );
};
