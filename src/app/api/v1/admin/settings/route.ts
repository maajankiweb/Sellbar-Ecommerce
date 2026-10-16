import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthUserContext } from '@/lib/auth/middleware/authMiddleware';
import connectToDatabase from '@/lib/db/mongodb';
import { SiteSettings } from '@/lib/db/models/SiteSettings';
import { invalidateSiteSettingsCache, getSiteSettings } from '@/lib/settings/siteSettings';
import { z } from 'zod';

const UpdateSettingsSchema = z.object({
  warrantyMonthsDefault: z.number().int().min(1).max(36).optional(),
  replacementWindowDays: z.number().int().min(1).max(60).optional(),
  quoteValidityHours: z.number().int().min(1).max(720).optional(),
  supportPhone: z.string().max(20).optional(),
  supportEmail: z.string().email().optional(),
  legalEntityName: z.string().max(100).optional(),
  tradeName: z.string().max(100).optional(),
  gstin: z.string().max(20).optional(),
  registeredAddress: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    })
    .optional(),
  grievanceOfficer: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  enabledCategories: z.array(z.string()).optional(),
  payoutModes: z.array(z.string()).optional(),
  payoutApprovalLimit: z.number().int().min(0).max(1000000).optional(),
  codEnabled: z.boolean().optional(),
  gstScheme: z.enum(['STANDARD_GST', 'MARGIN_SCHEME']).optional(),
  standardGstRate: z.number().min(0).max(28).optional(),
});

// GET /api/v1/admin/settings - Read full settings for Admin editor
export const GET = withAuth(
  async (_req: NextRequest, _user: AuthUserContext) => {
    try {
      const settings = await getSiteSettings();
      return NextResponse.json({ success: true, data: settings });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch settings', error: String(error) },
        { status: 500 }
      );
    }
  },
  { roles: ['admin', 'super_admin'] }
);

// PATCH /api/v1/admin/settings - Update site policy settings
export const PATCH = withAuth(
  async (req: NextRequest, user: AuthUserContext) => {
    try {
      const body = await req.json().catch(() => ({}));
      const parsed = UpdateSettingsSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      await connectToDatabase();

      const updated = await SiteSettings.findOneAndUpdate(
        {},
        {
          $set: {
            ...parsed.data,
            updatedBy: user.userId,
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      invalidateSiteSettingsCache();

      return NextResponse.json({
        success: true,
        message: 'Site settings updated successfully',
        data: updated,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to update site settings', error: String(error) },
        { status: 500 }
      );
    }
  },
  { roles: ['admin', 'super_admin'] }
);
