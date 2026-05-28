-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'reviewer', 'operator');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('draft', 'pending_review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "StockCountStatus" AS ENUM ('draft', 'pending_review', 'completed', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "StockInType" AS ENUM ('purchase', 'production', 'return');

-- CreateEnum
CREATE TYPE "StockOutType" AS ENUM ('production_issue', 'scrap', 'transfer');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('stock_in', 'stock_out', 'stock_count_lock', 'stock_count_unlock', 'stock_count_adjustment');

-- CreateEnum
CREATE TYPE "InventoryTransactionDirection" AS ENUM ('increase', 'decrease');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('approved', 'rejected');

-- CreateEnum
CREATE TYPE "ExpiryStatus" AS ENUM ('normal', 'warning', 'expired');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('active', 'locked');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('stock_in_order', 'stock_out_order', 'stock_count_task');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('success', 'failure');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'active',
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "material_code" VARCHAR(50) NOT NULL,
    "material_name" VARCHAR(100) NOT NULL,
    "material_category" VARCHAR(50) NOT NULL,
    "specification" VARCHAR(255),
    "unit" VARCHAR(50) NOT NULL,
    "batch_managed" BOOLEAN NOT NULL DEFAULT true,
    "expiry_managed" BOOLEAN NOT NULL DEFAULT true,
    "storage_condition" VARCHAR(255),
    "status" "RecordStatus" NOT NULL DEFAULT 'active',
    "remark" TEXT,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "warehouse_code" VARCHAR(50) NOT NULL,
    "warehouse_name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(255),
    "status" "RecordStatus" NOT NULL DEFAULT 'active',
    "remark" TEXT,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_in_orders" (
    "id" TEXT NOT NULL,
    "order_no" VARCHAR(50) NOT NULL,
    "stock_in_type" "StockInType" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'draft',
    "applicant_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "source_reference" VARCHAR(100),
    "submitted_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "rejected_at" TIMESTAMPTZ(6),
    "remark" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_in_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_in_order_items" (
    "id" TEXT NOT NULL,
    "stock_in_order_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "lot_number" VARCHAR(100) NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "production_date" DATE,
    "expiry_date" DATE,
    "remark" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_in_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_in_order_item_sources" (
    "id" TEXT NOT NULL,
    "stock_in_order_item_id" TEXT NOT NULL,
    "upstream_material_id" TEXT NOT NULL,
    "upstream_lot_number" VARCHAR(100) NOT NULL,
    "consumed_quantity" DECIMAL(18,6) NOT NULL,
    "remark" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_in_order_item_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_out_orders" (
    "id" TEXT NOT NULL,
    "order_no" VARCHAR(50) NOT NULL,
    "stock_out_type" "StockOutType" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'draft',
    "applicant_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "destination" VARCHAR(255) NOT NULL,
    "submitted_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "rejected_at" TIMESTAMPTZ(6),
    "remark" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_out_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_out_order_items" (
    "id" TEXT NOT NULL,
    "stock_out_order_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "lot_number" VARCHAR(100) NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "remark" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_out_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_records" (
    "id" TEXT NOT NULL,
    "business_type" "BusinessType" NOT NULL,
    "business_id" TEXT NOT NULL,
    "review_step" INTEGER NOT NULL DEFAULT 1,
    "reviewer_id" TEXT NOT NULL,
    "decision" "ApprovalDecision" NOT NULL,
    "decision_reason" TEXT,
    "reviewed_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_balances" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "lot_number" VARCHAR(100) NOT NULL,
    "quantity_on_hand" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "quantity_available" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "quantity_locked" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "production_date" DATE,
    "expiry_date" DATE,
    "expiry_status" "ExpiryStatus" NOT NULL DEFAULT 'normal',
    "stock_status" "StockStatus" NOT NULL DEFAULT 'active',
    "last_transaction_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventory_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "lot_number" VARCHAR(100) NOT NULL,
    "transaction_type" "InventoryTransactionType" NOT NULL,
    "direction" "InventoryTransactionDirection" NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "quantity_before" DECIMAL(18,6) NOT NULL,
    "quantity_after" DECIMAL(18,6) NOT NULL,
    "source_type" "BusinessType" NOT NULL,
    "source_id" TEXT NOT NULL,
    "operated_by" TEXT NOT NULL,
    "operated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_trace_links" (
    "id" TEXT NOT NULL,
    "upstream_material_id" TEXT NOT NULL,
    "upstream_lot_number" VARCHAR(100) NOT NULL,
    "downstream_material_id" TEXT NOT NULL,
    "downstream_lot_number" VARCHAR(100) NOT NULL,
    "consumed_quantity" DECIMAL(18,6) NOT NULL,
    "produced_quantity" DECIMAL(18,6) NOT NULL,
    "reference_type" "BusinessType" NOT NULL,
    "reference_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batch_trace_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_count_tasks" (
    "id" TEXT NOT NULL,
    "task_no" VARCHAR(50) NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "task_scope" VARCHAR(255) NOT NULL,
    "status" "StockCountStatus" NOT NULL DEFAULT 'draft',
    "applicant_id" TEXT NOT NULL,
    "submitted_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "rejected_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "remark" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_count_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_count_items" (
    "id" TEXT NOT NULL,
    "stock_count_task_id" TEXT NOT NULL,
    "inventory_balance_id" TEXT NOT NULL,
    "system_quantity" DECIMAL(18,6) NOT NULL,
    "counted_quantity" DECIMAL(18,6) NOT NULL,
    "variance_quantity" DECIMAL(18,6) NOT NULL,
    "variance_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_count_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "target_type" VARCHAR(50) NOT NULL,
    "target_id" TEXT NOT NULL,
    "operator_id" TEXT NOT NULL,
    "result" "AuditResult" NOT NULL,
    "summary" VARCHAR(500) NOT NULL,
    "operated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "materials_material_code_key" ON "materials"("material_code");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_warehouse_code_key" ON "warehouses"("warehouse_code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_in_orders_order_no_key" ON "stock_in_orders"("order_no");

-- CreateIndex
CREATE INDEX "stock_in_orders_status_submitted_at_idx" ON "stock_in_orders"("status", "submitted_at" DESC);

-- CreateIndex
CREATE INDEX "stock_in_orders_applicant_id_created_at_idx" ON "stock_in_orders"("applicant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "stock_in_order_items_stock_in_order_id_idx" ON "stock_in_order_items"("stock_in_order_id");

-- CreateIndex
CREATE INDEX "stock_in_order_items_material_id_idx" ON "stock_in_order_items"("material_id");

-- CreateIndex
CREATE INDEX "stock_in_order_item_sources_stock_in_order_item_id_idx" ON "stock_in_order_item_sources"("stock_in_order_item_id");

-- CreateIndex
CREATE INDEX "stock_in_order_item_sources_upstream_material_id_upstream_l_idx" ON "stock_in_order_item_sources"("upstream_material_id", "upstream_lot_number");

-- CreateIndex
CREATE UNIQUE INDEX "stock_out_orders_order_no_key" ON "stock_out_orders"("order_no");

-- CreateIndex
CREATE INDEX "stock_out_orders_status_submitted_at_idx" ON "stock_out_orders"("status", "submitted_at" DESC);

-- CreateIndex
CREATE INDEX "stock_out_orders_applicant_id_created_at_idx" ON "stock_out_orders"("applicant_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "stock_out_order_items_stock_out_order_id_idx" ON "stock_out_order_items"("stock_out_order_id");

-- CreateIndex
CREATE INDEX "stock_out_order_items_material_id_idx" ON "stock_out_order_items"("material_id");

-- CreateIndex
CREATE INDEX "approval_records_business_type_business_id_idx" ON "approval_records"("business_type", "business_id");

-- CreateIndex
CREATE INDEX "approval_records_reviewer_id_reviewed_at_idx" ON "approval_records"("reviewer_id", "reviewed_at" DESC);

-- CreateIndex
CREATE INDEX "inventory_balances_material_id_idx" ON "inventory_balances"("material_id");

-- CreateIndex
CREATE INDEX "inventory_balances_warehouse_id_idx" ON "inventory_balances"("warehouse_id");

-- CreateIndex
CREATE INDEX "inventory_balances_expiry_status_expiry_date_idx" ON "inventory_balances"("expiry_status", "expiry_date");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_balances_material_id_warehouse_id_lot_number_key" ON "inventory_balances"("material_id", "warehouse_id", "lot_number");

-- CreateIndex
CREATE INDEX "inventory_transactions_material_id_warehouse_id_lot_number__idx" ON "inventory_transactions"("material_id", "warehouse_id", "lot_number", "operated_at" DESC);

-- CreateIndex
CREATE INDEX "inventory_transactions_source_type_source_id_idx" ON "inventory_transactions"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "batch_trace_links_upstream_material_id_upstream_lot_number_idx" ON "batch_trace_links"("upstream_material_id", "upstream_lot_number");

-- CreateIndex
CREATE INDEX "batch_trace_links_downstream_material_id_downstream_lot_num_idx" ON "batch_trace_links"("downstream_material_id", "downstream_lot_number");

-- CreateIndex
CREATE UNIQUE INDEX "stock_count_tasks_task_no_key" ON "stock_count_tasks"("task_no");

-- CreateIndex
CREATE UNIQUE INDEX "stock_count_items_stock_count_task_id_inventory_balance_id_key" ON "stock_count_items"("stock_count_task_id", "inventory_balance_id");

-- CreateIndex
CREATE INDEX "stock_count_items_stock_count_task_id_idx" ON "stock_count_items"("stock_count_task_id");

-- CreateIndex
CREATE INDEX "stock_count_items_inventory_balance_id_idx" ON "stock_count_items"("inventory_balance_id");

-- CreateIndex
CREATE INDEX "audit_logs_target_type_target_id_idx" ON "audit_logs"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "audit_logs_operator_id_operated_at_idx" ON "audit_logs"("operator_id", "operated_at" DESC);

-- AddCheckConstraint
ALTER TABLE "stock_in_order_items" ADD CONSTRAINT "stock_in_order_items_quantity_check" CHECK ("quantity" > 0);
ALTER TABLE "stock_in_order_items" ADD CONSTRAINT "stock_in_order_items_expiry_date_check" CHECK ("production_date" IS NULL OR "expiry_date" IS NULL OR "expiry_date" >= "production_date");
ALTER TABLE "stock_in_order_item_sources" ADD CONSTRAINT "stock_in_order_item_sources_consumed_quantity_check" CHECK ("consumed_quantity" > 0);
ALTER TABLE "stock_out_order_items" ADD CONSTRAINT "stock_out_order_items_quantity_check" CHECK ("quantity" > 0);
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_quantity_on_hand_check" CHECK ("quantity_on_hand" >= 0);
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_quantity_available_check" CHECK ("quantity_available" >= 0);
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_quantity_locked_check" CHECK ("quantity_locked" >= 0);
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_quantity_consistency_check" CHECK ("quantity_on_hand" = "quantity_available" + "quantity_locked");
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_expiry_date_check" CHECK ("production_date" IS NULL OR "expiry_date" IS NULL OR "expiry_date" >= "production_date");
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_quantity_check" CHECK ("quantity" > 0);
ALTER TABLE "batch_trace_links" ADD CONSTRAINT "batch_trace_links_consumed_quantity_check" CHECK ("consumed_quantity" > 0);
ALTER TABLE "batch_trace_links" ADD CONSTRAINT "batch_trace_links_produced_quantity_check" CHECK ("produced_quantity" > 0);
ALTER TABLE "stock_count_items" ADD CONSTRAINT "stock_count_items_system_quantity_check" CHECK ("system_quantity" >= 0);
ALTER TABLE "stock_count_items" ADD CONSTRAINT "stock_count_items_counted_quantity_check" CHECK ("counted_quantity" >= 0);
ALTER TABLE "stock_count_items" ADD CONSTRAINT "stock_count_items_variance_quantity_check" CHECK ("variance_quantity" = "counted_quantity" - "system_quantity");

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_in_orders" ADD CONSTRAINT "stock_in_orders_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_in_orders" ADD CONSTRAINT "stock_in_orders_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_in_order_items" ADD CONSTRAINT "stock_in_order_items_stock_in_order_id_fkey" FOREIGN KEY ("stock_in_order_id") REFERENCES "stock_in_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_in_order_items" ADD CONSTRAINT "stock_in_order_items_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_in_order_item_sources" ADD CONSTRAINT "stock_in_order_item_sources_stock_in_order_item_id_fkey" FOREIGN KEY ("stock_in_order_item_id") REFERENCES "stock_in_order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_in_order_item_sources" ADD CONSTRAINT "stock_in_order_item_sources_upstream_material_id_fkey" FOREIGN KEY ("upstream_material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_out_orders" ADD CONSTRAINT "stock_out_orders_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_out_orders" ADD CONSTRAINT "stock_out_orders_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_out_order_items" ADD CONSTRAINT "stock_out_order_items_stock_out_order_id_fkey" FOREIGN KEY ("stock_out_order_id") REFERENCES "stock_out_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_out_order_items" ADD CONSTRAINT "stock_out_order_items_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_records" ADD CONSTRAINT "approval_records_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_operated_by_fkey" FOREIGN KEY ("operated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_trace_links" ADD CONSTRAINT "batch_trace_links_upstream_material_id_fkey" FOREIGN KEY ("upstream_material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_trace_links" ADD CONSTRAINT "batch_trace_links_downstream_material_id_fkey" FOREIGN KEY ("downstream_material_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_tasks" ADD CONSTRAINT "stock_count_tasks_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_tasks" ADD CONSTRAINT "stock_count_tasks_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_items" ADD CONSTRAINT "stock_count_items_stock_count_task_id_fkey" FOREIGN KEY ("stock_count_task_id") REFERENCES "stock_count_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_count_items" ADD CONSTRAINT "stock_count_items_inventory_balance_id_fkey" FOREIGN KEY ("inventory_balance_id") REFERENCES "inventory_balances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
