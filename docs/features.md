# CCSS Consultory Frontend - Features Guide

This document outlines the main features and modules of the system.

## 1. Dashboard
The entry point of the application featuring:
- **Quick Links (Acciones Rápidas):** Direct shortcuts to create new Patients, Diagnoses, Medicines, and Users, using URL params (`?action=new`).
- **Global Recent Activity:** A real-time timeline showing recent actions across all modules (created, edited, deleted). Powered by a global `ActivityContext` persisting in `localStorage`.

## 2. Diagnoses & Triage Queue ("Modo Atención")
The most advanced module of the system, designed to facilitate a doctor's workflow:
- **Modo Atención:** A priority-based queue. It evaluates the "weight" of the patient's associated disease (High, Medium, Low priority) and automatically sorts the pending patients. When activated, the doctor is presented ONLY with the single most critical patient to attend.
- **Tab System:** 
  - **Pendientes:** Queue governed by the priority triage logic.
  - **Atendidos:** A historical view of patients already reviewed.
- **Auto-Routing:** When a doctor clicks "Generar Nuevo Diagnóstico" on a pending patient and saves it, the patient is automatically flagged as "attended" and moved out of the queue into the "Atendidos" tab.

## 3. Core Modules (CRUDs)
The system contains standard modular pages to manage the consultory data:
- **Patients:** Register and edit patients.
- **Diseases:** Catalog of recognized diseases. Every disease must be linked to a Priority (which feeds the Triage).
- **Drugs:** Medicine inventory.
- **Users:** Management of doctors and system admins.

## 4. UI/UX Functionality
- **Dynamic Data Tables:** Uses a reusable abstract `<DataTable>` component supporting pagination, searching, and injected custom actions (like the Stethoscope button).
- **Notifications:** Built-in toast notifications using `sonner` to inform the user of successful or failed actions.
