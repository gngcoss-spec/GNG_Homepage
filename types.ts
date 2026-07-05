// Type definitions for GNG homepage
// (reconstructed from component usage — preserved structure exactly)

import { LucideIcon } from 'lucide-react';

export interface TechItem {
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PlatformFeature {
  title: string;
  items: string[];
}

export interface PlatformValueProp {
  title: string;
  description: string;
}

export interface PlatformDetail {
  title: string;
  description: string;
  features: PlatformFeature[];
  valueProp: PlatformValueProp;
}

export interface PlatformItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  detail: PlatformDetail;
}
