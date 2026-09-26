import { NextResponse } from 'next/server';
import crypto from 'crypto';

export interface DeviceRecord {
  id: string;
  deviceId: string;
  imei: string;
  serialNumber: string;
  modelName: string;
  brand: string;
  category: string;
  storage: string;
  color: string;
  batteryHealth: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  warehouse: string;
  zone: 'RECEIVING' | 'DATA_WIPE' | 'REPAIR' | 'QC' | 'READY_FOR_RESALE' | 'PACKING' | 'DISPATCH' | 'RECYCLING';
  rackBin: string;
  status: 'RECEIVED' | 'DATA_WIPED' | 'REPAIR_IN_PROGRESS' | 'QC_PASSED' | 'GRADED' | 'LISTED' | 'SOLD';
  financials: {
    buybackPrice: number;
    logisticsCost: number;
    repairCost: number;
    partsCost: number;
    warehouseOverhead: number;
    totalCost: number;
    sellingPrice: number;
    grossProfit: number;
    grossMarginPercent: number;
  };
  dataWipe: {
    wiped: boolean;
    certificateId?: string;
    wipedAt?: string;
    sha256Hash?: string;
  };
  qualityControl: {
    passed: boolean;
    inspectedAt?: string;
    scorePercent: number;
  };
  partsReplaced: Array<{
    partName: string;
    cost: number;
  }>;
}

// In-memory demo store populated with representative pipeline devices
let warehouseDevices: DeviceRecord[] = [
  {
    id: 'dev-1',
    deviceId: 'DEV-2026-001092',
    imei: '358941098234120',
    serialNumber: 'G6TZ1028X1',
    modelName: 'Apple iPhone 14',
    brand: 'Apple',
    category: 'phone',
    storage: '128GB',
    color: 'Midnight',
    batteryHealth: 92,
    grade: 'A+',
    warehouse: 'Patna Central Hub',
    zone: 'RECEIVING',
    rackBin: 'Rack A-01, Bin B-03',
    status: 'RECEIVED',
    financials: {
      buybackPrice: 34500,
      logisticsCost: 450,
      repairCost: 0,
      partsCost: 0,
      warehouseOverhead: 350,
      totalCost: 35300,
      sellingPrice: 42999,
      grossProfit: 7699,
      grossMarginPercent: 17.9,
    },
    dataWipe: { wiped: false },
    qualityControl: { passed: false, scorePercent: 0 },
    partsReplaced: [],
  },
  {
    id: 'dev-2',
    deviceId: 'DEV-2026-001088',
    imei: '356781293847562',
    serialNumber: 'SM23F9018K',
    modelName: 'Samsung Galaxy S23 5G',
    brand: 'Samsung',
    category: 'phone',
    storage: '256GB',
    color: 'Phantom Black',
    batteryHealth: 88,
    grade: 'A',
    warehouse: 'Patna Central Hub',
    zone: 'DATA_WIPE',
    rackBin: 'Rack B-02, Bin C-01',
    status: 'DATA_WIPED',
    financials: {
      buybackPrice: 28500,
      logisticsCost: 450,
      repairCost: 0,
      partsCost: 0,
      warehouseOverhead: 350,
      totalCost: 29300,
      sellingPrice: 38999,
      grossProfit: 9699,
      grossMarginPercent: 24.9,
    },
    dataWipe: {
      wiped: true,
      certificateId: 'NIST-2026-90182',
      wipedAt: '25 Sep 2026, 11:20 AM',
      sha256Hash: '4a6b2c89f1d0e3a4789123847582910394857201948572019485720194857201',
    },
    qualityControl: { passed: false, scorePercent: 0 },
    partsReplaced: [],
  },
  {
    id: 'dev-3',
    deviceId: 'DEV-2026-001075',
    imei: '864719038291042',
    serialNumber: 'OP11X8910Q',
    modelName: 'OnePlus 11 5G',
    brand: 'OnePlus',
    category: 'phone',
    storage: '256GB',
    color: 'Titan Black',
    batteryHealth: 94,
    grade: 'A',
    warehouse: 'Patna Central Hub',
    zone: 'REPAIR',
    rackBin: 'Rack C-01, Bin A-02',
    status: 'REPAIR_IN_PROGRESS',
    financials: {
      buybackPrice: 22000,
      logisticsCost: 450,
      repairCost: 1200,
      partsCost: 1499,
      warehouseOverhead: 350,
      totalCost: 25499,
      sellingPrice: 34999,
      grossProfit: 9500,
      grossMarginPercent: 27.1,
    },
    dataWipe: {
      wiped: true,
      certificateId: 'NIST-2026-78491',
      wipedAt: '24 Sep 2026, 03:45 PM',
      sha256Hash: '98e12a45bc3d8e9f0123456789abcdef0123456789abcdef0123456789abcdef',
    },
    qualityControl: { passed: false, scorePercent: 0 },
    partsReplaced: [{ partName: 'OEM High-Capacity Battery Pack', cost: 1499 }],
  },
  {
    id: 'dev-4',
    deviceId: 'DEV-2026-001062',
    imei: '354891028374619',
    serialNumber: 'F2LX9102K1',
    modelName: 'Apple iPhone 13',
    brand: 'Apple',
    category: 'phone',
    storage: '128GB',
    color: 'Starlight',
    batteryHealth: 91,
    grade: 'A+',
    warehouse: 'Patna Central Hub',
    zone: 'READY_FOR_RESALE',
    rackBin: 'Rack D-04, Bin B-02',
    status: 'GRADED',
    financials: {
      buybackPrice: 26000,
      logisticsCost: 450,
      repairCost: 0,
      partsCost: 0,
      warehouseOverhead: 350,
      totalCost: 26800,
      sellingPrice: 34499,
      grossProfit: 7699,
      grossMarginPercent: 22.3,
    },
    dataWipe: {
      wiped: true,
      certificateId: 'NIST-2026-66291',
      wipedAt: '23 Sep 2026, 05:10 PM',
      sha256Hash: 'b3f91a0c849e2d7e102938475610293847561029384756102938475610293847',
    },
    qualityControl: { passed: true, scorePercent: 100, inspectedAt: '24 Sep 2026, 10:15 AM' },
    partsReplaced: [],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneFilter = searchParams.get('zone');
    const query = searchParams.get('q')?.toLowerCase();

    let filtered = warehouseDevices;

    if (zoneFilter && zoneFilter !== 'all') {
      filtered = filtered.filter((d) => d.zone === zoneFilter);
    }

    if (query) {
      filtered = filtered.filter(
        (d) =>
          d.deviceId.toLowerCase().includes(query) ||
          d.imei.toLowerCase().includes(query) ||
          d.modelName.toLowerCase().includes(query)
      );
    }

    // Pipeline Analytics
    const totalInventoryValue = filtered.reduce((acc, d) => acc + d.financials.totalCost, 0);
    const expectedResaleValue = filtered.reduce((acc, d) => acc + d.financials.sellingPrice, 0);
    const projectedGrossProfit = expectedResaleValue - totalInventoryValue;
    const avgMarginPercent =
      expectedResaleValue > 0
        ? Math.round((projectedGrossProfit / expectedResaleValue) * 1000) / 10
        : 0;

    const zoneCounts = {
      RECEIVING: warehouseDevices.filter((d) => d.zone === 'RECEIVING').length,
      DATA_WIPE: warehouseDevices.filter((d) => d.zone === 'DATA_WIPE').length,
      REPAIR: warehouseDevices.filter((d) => d.zone === 'REPAIR').length,
      QC: warehouseDevices.filter((d) => d.zone === 'QC').length,
      READY_FOR_RESALE: warehouseDevices.filter((d) => d.zone === 'READY_FOR_RESALE').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        devices: filtered,
        metrics: {
          totalUnits: warehouseDevices.length,
          totalInventoryValue,
          expectedResaleValue,
          projectedGrossProfit,
          avgMarginPercent,
          zoneCounts,
        },
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve warehouse devices';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, deviceId, payload } = body;

    const device = warehouseDevices.find((d) => d.deviceId === deviceId);
    if (!device) {
      return NextResponse.json({ success: false, error: `Device ${deviceId} not found` }, { status: 404 });
    }

    switch (action) {
      case 'PERFORM_DATA_WIPE': {
        const certId = `NIST-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const sha256 = crypto.createHash('sha256').update(`${device.imei}:${certId}:${Date.now()}`).digest('hex');

        device.dataWipe = {
          wiped: true,
          certificateId: certId,
          wipedAt: new Date().toLocaleString('en-IN'),
          sha256Hash: sha256,
        };
        device.zone = 'REPAIR';
        device.status = 'DATA_WIPED';
        break;
      }

      case 'COMPLETE_REPAIR': {
        const partName = payload?.partName || 'OEM Certified Module';
        const partCost = Number(payload?.partCost) || 1200;

        device.partsReplaced.push({ partName, cost: partCost });
        device.financials.partsCost += partCost;
        device.financials.totalCost += partCost;
        device.financials.grossProfit = device.financials.sellingPrice - device.financials.totalCost;
        device.financials.grossMarginPercent =
          Math.round((device.financials.grossProfit / device.financials.sellingPrice) * 1000) / 10;

        device.zone = 'QC';
        device.status = 'REPAIR_IN_PROGRESS';
        break;
      }

      case 'QC_AND_GRADE': {
        const grade = payload?.grade || 'A+';
        const batteryHealth = Number(payload?.batteryHealth) || 91;

        device.grade = grade;
        device.batteryHealth = batteryHealth;
        device.qualityControl = {
          passed: true,
          scorePercent: 100,
          inspectedAt: new Date().toLocaleString('en-IN'),
        };
        device.zone = 'READY_FOR_RESALE';
        device.status = 'GRADED';
        break;
      }

      case 'PUBLISH_MARKETPLACE': {
        // Business Rule #8: Cannot list for resale before data wipe is completed!
        if (!device.dataWipe.wiped) {
          return NextResponse.json(
            {
              success: false,
              error: 'Compliance Violation: Device cannot be published for resale before NIST 800-88 data sanitization is verified.',
            },
            { status: 422 }
          );
        }

        device.status = 'LISTED';
        break;
      }

      default:
        return NextResponse.json({ success: false, error: `Invalid action '${action}'` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Action ${action} executed successfully on ${deviceId}`,
      data: device,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Warehouse lifecycle action failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
