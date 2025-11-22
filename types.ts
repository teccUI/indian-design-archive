export interface DesignStudio {
  id: string;
  name: string;
  initial: string;
  description: string;
  services: string[];
  location: string;
  website: string;
}

export type FilterCategory = 'All' | 'Architecture' | 'Fashion' | 'Graphic Design' | 'Industrial' | 'Interior' | 'Product' | 'Typography';