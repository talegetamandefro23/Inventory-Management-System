import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppStoreProvider } from "./context/AppStoreContext";
import Layout from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import ItemsLibrary from "./pages/MasterData/ItemsLibrary";
import ItemDetail from "./pages/MasterData/ItemDetail";
import InventoryOverview from "./pages/Inventory/InventoryOverview";
import StockIn from "./pages/Inventory/StockIn";
import StockOut from "./pages/Inventory/StockOut";
import StockTransfer from "./pages/Inventory/StockTransfer";
import PhysicalAudit from "./pages/Inventory/PhysicalAudit";
import ReceivingBoard from "./pages/Warehouse/ReceivingBoard";
import PutawayPlanner from "./pages/Warehouse/PutawayPlanner";
import WarehouseMap from "./pages/Warehouse/WarehouseMap";
import PickingPacking from "./pages/Warehouse/PickingPacking";
import Requisitions from "./pages/Procurement/Requisitions";
import NewRequisition from "./pages/Procurement/NewRequisition";
import RfqComparison from "./pages/Procurement/RfqComparison";
import PurchaseOrders from "./pages/Procurement/PurchaseOrders";
import Assets from "./pages/Assets";
import Approvals from "./pages/Approvals";
import Reports from "./pages/Reports";
import Administration from "./pages/Administration";

export default function App() {
  return (
    <ThemeProvider>
      <AppStoreProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Master Data */}
            <Route path="/master-data/items" element={<ItemsLibrary />} />
            <Route path="/master-data/items/:id" element={<ItemDetail />} />

            {/* Inventory */}
            <Route path="/inventory/overview" element={<InventoryOverview />} />
            <Route path="/inventory/stock-in" element={<StockIn />} />
            <Route path="/inventory/stock-out" element={<StockOut />} />
            <Route path="/inventory/stock-transfer" element={<StockTransfer />} />
            <Route path="/inventory/physical-audit" element={<PhysicalAudit />} />

            {/* Warehouse */}
            <Route path="/warehouse/receiving" element={<ReceivingBoard />} />
            <Route path="/warehouse/putaway" element={<PutawayPlanner />} />
            <Route path="/warehouse/map" element={<WarehouseMap />} />
            <Route path="/warehouse/picking" element={<PickingPacking />} />

            {/* Procurement */}
            <Route path="/procurement/requisitions" element={<Requisitions />} />
            <Route path="/procurement/requisitions/new" element={<NewRequisition />} />
            <Route path="/procurement/rfq" element={<RfqComparison />} />
            <Route path="/procurement/orders" element={<PurchaseOrders />} />

            {/* Other modules */}
            <Route path="/assets" element={<Assets />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/administration" element={<Administration />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
