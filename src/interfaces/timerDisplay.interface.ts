import { DataInterface } from "./data.interface";

export interface TimerDisplayProps {
  handleDecrement: (field: keyof DataInterface) => void;
  handleIncrement: (field: keyof DataInterface) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: DataInterface;
}
