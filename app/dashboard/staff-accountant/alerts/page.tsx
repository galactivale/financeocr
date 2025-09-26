"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";

// Alert data structure for Staff Accountant
interface StaffAlert {
  id: string;
  title: string;
  message: string;
  category: 'task-assignment' | 'client-communication' | 'system-update' | 'quality-feedback' | 'professional-development';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'actioned' | 'dismissed';
  createdAt: string;
  dueDate?: string;
  client?: {
    id: string;
    name: string;
    avatar: string;
  };
  supervisor?: {
    name: string;
    role: string;
  };
  actions?: {
    id: string;
    label: string;
    type: 'accept' | 'escalate' | 'respond' | 'complete' | 'learn';
    primary?: boolean;
  }[];
  learningContent?: {
    title: string;
    description: string;
    resources: string[];
  };
  qualityMetrics?: {
    accuracy?: number;
    timeliness?: number;
    completeness?: number;
  };
}
