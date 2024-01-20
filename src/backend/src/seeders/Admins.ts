import { AdminAtterbuites } from '@/models/Atterbuites/Admin';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
dotenv.config();

export const Admins = async (): Promise<AdminAtterbuites[]> => {
    const salt = await bcrypt.genSalt(10);
    const email: string = process.env.admin_email || "admin@iptv.com";
    const password: string = process.env.admin_pass || "123456";
    const api_token: string = process.env.api_token || "A1f3cCbd988Pdf7180a510b-51e462ae5654837c87f00392b9d2b72d-35ea6a5";

    const hashedPassword = await bcrypt.hash(password, salt);
    return [{
        email: email,
        password: hashedPassword,
        api_token: api_token,
        created_at: new Date(),
        updated_at: new Date()
    } as AdminAtterbuites];
};

export const SeedAdminTable = async (db: any, Admins: AdminAtterbuites[]) => {
    try {
      Admins.map(async (admin) => {
        const existingAdmin = await db.admins.findOne({ where: { email: admin.email } });
        if (!existingAdmin) {
          await db.admins.create(admin);
          console.log(`Admin '${admin.email}' created successfully.`);
        }
      });
    } catch (error) {
      console.error('Error seeding admin data:', error);
    }
  }

