import { TableHeader } from "@/components/composed/basic-table/basic-table";
import { AnyType } from "@/types";

export interface TableData {
  key: string;
  id: string;
  title: string;
  overviewTableData: Record<string, AnyType> | undefined;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  rows: Record<string, AnyType>[];
  level: number;
}

export interface Filters {
  header: string;
  value: string;
}

export interface SearchByObject {
  title: string;
  level: number;
  value: string;
  bg: string;
}

export interface CommonTableProps {
  transitionFunc: React.TransitionStartFunction;
  mappingValue: string;
  groupingValue: string;
  selectedFilter: Filters;
  basicTableData: Record<string, string>[];
  basicTableHeader: TableHeader[];
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
  setIsProcessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  valueKey: string;
}

export type ProcessValue = {
  title: string;
  rows: Record<string, AnyType>[];
  level: number;
  parent?: SearchByObject;
};

export interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  overviewTableData: Record<string, AnyType>;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  selectedFilter: Filters;
  commonTableProps: CommonTableProps;
  filterValueOptions: string[];
  initialProcessObject: ProcessValue | undefined;
  basicTableData: Record<string, string>[];
  basicTableHeader: TableHeader[];
}
