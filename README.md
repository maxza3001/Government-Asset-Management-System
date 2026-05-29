# Government Asset Management System

ระบบบริหารครุภัณฑ์ราชการ สร้างด้วย Next.js และ Supabase

## Tech Stack

- Next.js App Router
- React
- Supabase Auth
- Supabase Postgres + Row Level Security
- Tailwind CSS
- Recharts

## Local Setup

ติดตั้ง dependencies:

```bash
pnpm install
```

สร้างไฟล์ `.env.local` จาก `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

รันตรวจสอบและเริ่ม dev server:

```bash
pnpm lint
pnpm build
pnpm dev
```

เปิด:

```text
http://localhost:3000
```

## Supabase Setup

1. สร้าง Supabase project ใหม่
2. ไปที่ **SQL Editor**
3. เปิดไฟล์ `supabase_schema.sql`
4. คัดลอก SQL ทั้งไฟล์ไปรันใน SQL Editor
5. ไปที่ **Project Settings -> API**
6. คัดลอกค่าเหล่านี้ไปใช้ใน `.env.local` และ Vercel:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Enable Email Login

ไปที่ **Authentication -> Providers -> Email** แล้วเปิด Email/Password login

### Enable Google Login

ถ้าต้องการให้ปุ่ม Google ในหน้า login ใช้งานได้ ให้เปิด Google provider ใน Supabase:

1. ไปที่ **Authentication -> Providers -> Google**
2. เปิด Google provider
3. ใส่ `Client ID` และ `Client Secret` จาก Google Cloud Console
4. ใน Google Cloud Console ให้ตั้ง Authorized redirect URI เป็น callback ของ Supabase:

```text
https://your-project.supabase.co/auth/v1/callback
```

แทน `your-project.supabase.co` ด้วย Supabase project URL ของคุณ

หลังเปิด Google provider แล้ว ปุ่ม Google จะ redirect ไป Google OAuth กลับมาที่ `/auth/callback` เพื่อสร้าง session แล้วค่อยส่งต่อไป `/dashboard`

### Create Admin User

1. ไปที่ **Authentication -> Users**
2. Add user ด้วย email/password
3. กลับไปที่ **SQL Editor**
4. ตั้ง role ให้ผู้ใช้เป็น admin:

```sql
UPDATE profiles
SET
  role = 'super_admin',
  full_name = 'System Administrator',
  department = 'IT'
WHERE email = 'your-admin-email@example.com';
```

Role ที่ใช้ได้:

- `super_admin`
- `asset_admin`
- `staff`
- `user`
- `auditor`

### Seed System Settings

รัน SQL นี้เพื่อเพิ่มค่าเริ่มต้นของหน้า Settings:

```sql
INSERT INTO system_settings (key, value)
VALUES
  ('organization_name', '"Government Asset Office"'::jsonb),
  ('fiscal_year', '"2569"'::jsonb),
  ('asset_code_prefix', '"AST"'::jsonb),
  ('notify_before_return_days', '3'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

### Auth Redirect URLs

ไปที่ **Authentication -> URL Configuration**

ตั้งค่า **Site URL** เป็น production URL:

```text
https://your-app.vercel.app
```

เพิ่ม **Redirect URLs**:

```text
http://localhost:3000/**
http://localhost:3000/auth/callback
https://your-app.vercel.app/**
https://your-app.vercel.app/auth/callback
```

ถ้าใช้ Vercel preview deployment หลาย URL สามารถเพิ่ม pattern ของ preview URL เพิ่มได้ตามทีม/บัญชี Vercel ของคุณ

## Deploy to Vercel

1. Push โปรเจกต์ขึ้น GitHub
2. เข้า Vercel
3. เลือก **Add New Project**
4. Import repository นี้
5. ตรวจว่า Framework เป็น **Next.js**
6. เพิ่ม Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

7. กด Deploy

หลังแก้ Environment Variables บน Vercel ต้อง redeploy ใหม่ ค่าจึงจะมีผลกับ deployment ล่าสุด

## Post-deploy Checklist

หลัง deploy เสร็จ ให้ทดสอบ URL เหล่านี้:

- `/login`
- `/dashboard`
- `/reports`
- `/users`
- `/settings`
- `/audit-logs`

ทดสอบ flow หลัก:

- login ด้วย Supabase email/password
- refresh หน้าหลังบ้านแล้วยังอยู่ในระบบ
- logout แล้วกลับไป `/login`
- หน้า Reports โหลดข้อมูลจาก Supabase
- หน้า Users แก้ `full_name`, `role`, `department` ได้
- หน้า Settings บันทึกแล้ว refresh ยังเห็นค่าเดิม
- หน้า Audit Logs แสดงรายการและค้นหา/กรองได้

## Troubleshooting

### Login แล้วเข้าไม่ได้

ตรวจว่า:

- Email provider เปิดอยู่ใน Supabase
- user ถูกสร้างใน Authentication -> Users
- `.env.local` หรือ Vercel env ใช้ `Project URL` และ `anon public key` ถูกต้อง

### Google login ขึ้น `400: redirect_uri_mismatch`

error นี้เกิดจาก Google Cloud OAuth client ยังไม่ได้อนุญาต callback URL ของ Supabase

ให้ไปที่ Google Cloud Console:

1. เปิด **APIs & Services -> Credentials**
2. เลือก OAuth 2.0 Client ID ที่นำมาใช้กับ Supabase
3. ในหัวข้อ **Authorized redirect URIs** เพิ่ม URL นี้:

```text
https://your-project.supabase.co/auth/v1/callback
```

เปลี่ยน `your-project.supabase.co` ให้ตรงกับ Supabase Project URL จริง

ตัวอย่าง:

```text
https://abcdefghijklm.supabase.co/auth/v1/callback
```

จากนั้นกด Save แล้วรอ Google อัปเดตสักครู่ ก่อนลองกดปุ่ม Google login ใหม่

ถ้าใช้งาน local และ production ให้ตรวจ Supabase ด้วย:

- Supabase -> Authentication -> URL Configuration
- Site URL: `https://your-app.vercel.app`
- Redirect URLs:

```text
http://localhost:3000/**
https://your-app.vercel.app/**
```

### Users, Settings หรือ Audit Logs ขึ้น permission error

ตรวจ role ในตาราง `profiles`:

```sql
SELECT email, role, department
FROM profiles
ORDER BY created_at DESC;
```

ผู้ดูแลระบบควรมี role เป็น `super_admin` หรือ `asset_admin`

### หน้า Settings ขึ้น table missing

แปลว่ายังไม่ได้รัน `supabase_schema.sql` เวอร์ชันล่าสุด ให้รัน SQL ทั้งไฟล์อีกครั้ง หรือรันเฉพาะส่วน `system_settings`

### Deploy แล้ว env ไม่เปลี่ยน

หลังแก้ Environment Variables ใน Vercel ให้กด redeploy ใหม่

## Useful Commands

```bash
pnpm lint
pnpm build
pnpm dev
```

gh auth logout
gh auth login
git push -u origin main


git status
git add .
git commit
git push

## References

- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Password Auth: https://supabase.com/docs/guides/auth/passwords
- Supabase Redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
