export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  department: string;
  status: 'normal' | 'repair' | 'broken' | 'lost' | 'sold';
  purchaseDate: string;
  price: number;
}

export const mockAssets: Asset[] = [
  {
    id: "AST-2569-0001",
    assetCode: "7440-001-0001",
    name: "คอมพิวเตอร์โน้ตบุ๊ก (Notebook)",
    category: "ครุภัณฑ์คอมพิวเตอร์",
    brand: "Dell",
    model: "Latitude 5420",
    serialNumber: "SN-DEL5420-991",
    department: "กองสารสนเทศ",
    status: "normal",
    purchaseDate: "2023-05-10",
    price: 35000,
  },
  {
    id: "AST-2569-0002",
    assetCode: "7440-001-0002",
    name: "เครื่องพิมพ์เลเซอร์ (Laser Printer)",
    category: "ครุภัณฑ์คอมพิวเตอร์",
    brand: "HP",
    model: "LaserJet Pro",
    serialNumber: "SN-HP-88221",
    department: "กองบริหารทั่วไป",
    status: "repair",
    purchaseDate: "2022-11-20",
    price: 8500,
  },
  {
    id: "AST-2569-0003",
    assetCode: "4110-002-0005",
    name: "โต๊ะทำงานระดับบริหาร",
    category: "ครุภัณฑ์สำนักงาน",
    brand: "Modernform",
    model: "Executive EX-01",
    serialNumber: "-",
    department: "ห้องผู้อำนวยการ",
    status: "normal",
    purchaseDate: "2021-08-15",
    price: 12000,
  },
  {
    id: "AST-2569-0004",
    assetCode: "6550-005-0010",
    name: "รถบรรทุก (ดีเซล) ขนาด 1 ตัน",
    category: "ครุภัณฑ์ยานพาหนะ",
    brand: "Toyota",
    model: "Hilux Revo",
    serialNumber: "MRO11223344",
    department: "ส่วนยานพาหนะ",
    status: "normal",
    purchaseDate: "2020-02-10",
    price: 750000,
  }
];

export const mockDashboardStats = {
  total: 1254,
  normal: 1100,
  repair: 54,
  broken: 80,
  lost: 5,
  sold: 15,
  totalBudget: 45000000
};

export const mockActivities = [
  { id: 1, action: "ยืมครุภัณฑ์", detail: "คอมพิวเตอร์โน้ตบุ๊ก (Notebook)", user: "นายสมชาย ใจดี", date: "2026-05-28T09:30:00" },
  { id: 2, action: "แจ้งซ่อม", detail: "เครื่องพิมพ์เลเซอร์", user: "นางสาวสมศรี รักงาน", date: "2026-05-27T14:15:00" },
  { id: 3, action: "เพิ่มครุภัณฑ์ใหม่", detail: "รถบรรทุก 1 ตัน", user: "เจ้าหน้าที่พัสดุ", date: "2026-05-25T10:00:00" },
];
