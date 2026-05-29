import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  ArrowLeftRight, 
  Wrench, 
  FileText, 
  Settings, 
  Users,
  ShieldAlert
} from 'lucide-react';

const navItems = [
  { name: 'แดชบอร์ด', href: '/dashboard', icon: LayoutDashboard },
  { name: 'ทะเบียนครุภัณฑ์', href: '/assets', icon: Package },
  { name: 'ระบบติดตาม (Tracking)', href: '/tracking', icon: MapPin },
  { name: 'ระบบยืม-คืน', href: '/borrows', icon: ArrowLeftRight },
  { name: 'ระบบแจ้งซ่อม', href: '/maintenance', icon: Wrench },
  { name: 'รายงาน', href: '/reports', icon: FileText },
  { name: 'จัดการผู้ใช้งาน', href: '/users', icon: Users },
  { name: 'ตั้งค่าระบบ', href: '/settings', icon: Settings },
  { name: 'Audit Logs', href: '/audit-logs', icon: ShieldAlert },
];

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b border-white/10 px-4">
          <span className="text-lg font-bold truncate">ระบบบริหารครุภัณฑ์</span>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 mt-2">เมนูหลัก</div>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'bg-white/15 text-white font-medium' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-white/70'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
