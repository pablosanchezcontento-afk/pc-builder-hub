// Test seed script for development and testing
import Database from 'better-sqlite3';
import { resolve } from 'path';

const DB_PATH = resolve(process.cwd(), 'data/pc_components.db');

interface Component {
  name: string;
  type: string;
  price: number;
  specs: string;
  image_url: string;
  compatibility_notes?: string;
}

const testComponents: Component[] = [
  // CPUs
  {
    name: 'AMD Ryzen 9 7950X',
    type: 'cpu',
    price: 599.99,
    specs: JSON.stringify({
      cores: 16,
      threads: 32,
      base_clock: '4.5 GHz',
      boost_clock: '5.7 GHz',
      tdp: '170W',
      socket: 'AM5'
    }),
    image_url: '/images/cpu-ryzen9-7950x.jpg',
    compatibility_notes: 'Requires AM5 motherboard and DDR5 RAM'
  },
  {
    name: 'Intel Core i9-13900K',
    type: 'cpu',
    price: 589.99,
    specs: JSON.stringify({
      cores: 24,
      threads: 32,
      base_clock: '3.0 GHz',
      boost_clock: '5.8 GHz',
      tdp: '125W',
      socket: 'LGA1700'
    }),
    image_url: '/images/cpu-intel-i9-13900k.jpg',
    compatibility_notes: 'Requires LGA1700 motherboard'
  },
  // GPUs
  {
    name: 'NVIDIA RTX 4090',
    type: 'gpu',
    price: 1599.99,
    specs: JSON.stringify({
      memory: '24GB GDDR6X',
      core_clock: '2.23 GHz',
      boost_clock: '2.52 GHz',
      tdp: '450W',
      interface: 'PCIe 4.0 x16'
    }),
    image_url: '/images/gpu-rtx-4090.jpg',
    compatibility_notes: 'Requires 850W+ PSU, 3x 8-pin PCIe connectors'
  },
  {
    name: 'AMD Radeon RX 7900 XTX',
    type: 'gpu',
    price: 999.99,
    specs: JSON.stringify({
      memory: '24GB GDDR6',
      core_clock: '2.3 GHz',
      boost_clock: '2.5 GHz',
      tdp: '355W',
      interface: 'PCIe 4.0 x16'
    }),
    image_url: '/images/gpu-rx-7900xtx.jpg',
    compatibility_notes: 'Requires 750W+ PSU'
  },
  // Motherboards
  {
    name: 'ASUS ROG Strix X670E-E',
    type: 'motherboard',
    price: 499.99,
    specs: JSON.stringify({
      socket: 'AM5',
      chipset: 'X670E',
      ram_slots: 4,
      max_ram: '128GB',
      form_factor: 'ATX',
      pcie_slots: '4x PCIe 5.0'
    }),
    image_url: '/images/mb-asus-x670e.jpg',
    compatibility_notes: 'Compatible with AMD Ryzen 7000 series'
  },
  {
    name: 'MSI MPG Z790 Carbon',
    type: 'motherboard',
    price: 469.99,
    specs: JSON.stringify({
      socket: 'LGA1700',
      chipset: 'Z790',
      ram_slots: 4,
      max_ram: '128GB',
      form_factor: 'ATX',
      pcie_slots: '3x PCIe 5.0'
    }),
    image_url: '/images/mb-msi-z790.jpg',
    compatibility_notes: 'Compatible with Intel 12th/13th gen'
  },
  // RAM
  {
    name: 'G.Skill Trident Z5 RGB 32GB',
    type: 'ram',
    price: 179.99,
    specs: JSON.stringify({
      capacity: '32GB (2x16GB)',
      type: 'DDR5',
      speed: '6000MHz',
      cas_latency: 'CL36',
      voltage: '1.35V'
    }),
    image_url: '/images/ram-gskill-z5-32gb.jpg',
    compatibility_notes: 'DDR5 compatible motherboards only'
  },
  {
    name: 'Corsair Vengeance 64GB',
    type: 'ram',
    price: 249.99,
    specs: JSON.stringify({
      capacity: '64GB (2x32GB)',
      type: 'DDR5',
      speed: '5600MHz',
      cas_latency: 'CL40',
      voltage: '1.25V'
    }),
    image_url: '/images/ram-corsair-64gb.jpg',
    compatibility_notes: 'DDR5 compatible motherboards only'
  },
  // Storage
  {
    name: 'Samsung 990 PRO 2TB',
    type: 'storage',
    price: 189.99,
    specs: JSON.stringify({
      capacity: '2TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      read_speed: '7450 MB/s',
      write_speed: '6900 MB/s',
      form_factor: 'M.2 2280'
    }),
    image_url: '/images/ssd-samsung-990pro-2tb.jpg'
  },
  {
    name: 'WD Black SN850X 4TB',
    type: 'storage',
    price: 349.99,
    specs: JSON.stringify({
      capacity: '4TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      read_speed: '7300 MB/s',
      write_speed: '6600 MB/s',
      form_factor: 'M.2 2280'
    }),
    image_url: '/images/ssd-wd-black-4tb.jpg'
  },
  // PSU
  {
    name: 'Corsair RM1000e',
    type: 'psu',
    price: 179.99,
    specs: JSON.stringify({
      wattage: '1000W',
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      pcie_connectors: '5x 8-pin'
    }),
    image_url: '/images/psu-corsair-rm1000e.jpg',
    compatibility_notes: 'Suitable for high-end builds'
  },
  {
    name: 'EVGA SuperNOVA 850 P6',
    type: 'psu',
    price: 139.99,
    specs: JSON.stringify({
      wattage: '850W',
      efficiency: '80+ Platinum',
      modular: 'Fully Modular',
      pcie_connectors: '4x 8-pin'
    }),
    image_url: '/images/psu-evga-850p6.jpg'
  },
  // Cases
  {
    name: 'Lian Li O11 Dynamic EVO',
    type: 'case',
    price: 169.99,
    specs: JSON.stringify({
      form_factor: 'Mid Tower',
      motherboard_support: 'ATX, Micro-ATX, Mini-ITX',
      max_gpu_length: '420mm',
      fan_slots: '13x 120mm or 9x 140mm',
      radiator_support: '360mm top/bottom/side'
    }),
    image_url: '/images/case-lian-li-o11.jpg'
  },
  {
    name: 'NZXT H7 Flow',
    type: 'case',
    price: 129.99,
    specs: JSON.stringify({
      form_factor: 'Mid Tower',
      motherboard_support: 'ATX, Micro-ATX, Mini-ITX',
      max_gpu_length: '400mm',
      fan_slots: '7x 120mm or 5x 140mm',
      radiator_support: '360mm front/top'
    }),
    image_url: '/images/case-nzxt-h7.jpg'
  },
  // Cooling
  {
    name: 'NZXT Kraken 360 RGB',
    type: 'cooling',
    price: 239.99,
    specs: JSON.stringify({
      type: 'AIO Liquid Cooler',
      radiator_size: '360mm',
      fan_speed: '500-2000 RPM',
      noise_level: '21-36 dBA',
      socket_support: 'AM5, AM4, LGA1700, LGA1200'
    }),
    image_url: '/images/cooling-nzxt-kraken360.jpg'
  },
  {
    name: 'Noctua NH-D15 chromax.black',
    type: 'cooling',
    price: 109.99,
    specs: JSON.stringify({
      type: 'Air Cooler',
      height: '165mm',
      fan_speed: '300-1500 RPM',
      noise_level: '19.2-24.6 dBA',
      socket_support: 'AM5, AM4, LGA1700, LGA1200'
    }),
    image_url: '/images/cooling-noctua-nhd15.jpg'
  }
];

async function seedTestData() {
  console.log('🌱 Starting test database seeding...');
  
  try {
    const db = new Database(DB_PATH);
    
    // Clear existing data
    console.log('🗑️  Clearing existing test data...');
    db.prepare('DELETE FROM components').run();
    
    // Insert test components
    console.log('📦 Inserting test components...');
    const insert = db.prepare(`
      INSERT INTO components (name, type, price, specs, image_url, compatibility_notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    let inserted = 0;
    for (const component of testComponents) {
      insert.run(
        component.name,
        component.type,
        component.price,
        component.specs,
        component.image_url,
        component.compatibility_notes || null
      );
      inserted++;
    }
    
    console.log(`✅ Successfully inserted ${inserted} test components`);
    
    // Verify data
    const count = db.prepare('SELECT COUNT(*) as count FROM components').get() as { count: number };
    console.log(`📊 Total components in database: ${count.count}`);
    
    // Show breakdown by type
    console.log('\n📋 Components by type:');
    const typeBreakdown = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM components 
      GROUP BY type 
      ORDER BY type
    `).all() as Array<{ type: string; count: number }>;
    
    typeBreakdown.forEach(({ type, count }) => {
      console.log(`  ${type}: ${count}`);
    });
    
    db.close();
    console.log('\n✨ Test seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedTestData();
}

export { seedTestData, testComponents };
