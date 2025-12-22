/**
 * PHASE 4 – Script de validación de URLs del dataset seed
 * 
 * Este script valida todas las URLs de componentes usando validateSourceStrict()
 * y genera un reporte en español.
 */

import { validateSourceStrict } from "../lib/validateSource";
import { seedComponents } from "../data/seed";

interface ValidationResult {
  componentId: string;
  componentName: string;
  specsUrl: string;
  specsValid: boolean;
  specsError?: string;
  priceUrl: string;
  priceValid: boolean;
  priceError?: string;
}

async function validateAllComponents(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const component of seedComponents) {
    console.log(`\n🔍 Validando: ${component.model}...`);

    // Validar URL de specs
    const specsResult = validateSourceStrict(
      component.sources.specsUrl,
      component.sources.specsDataType
    );

    // Validar URL de precio
    const priceResult = validateSourceStrict(
      component.sources.priceUrl,
      "price"
    );

    const result: ValidationResult = {
      componentId: component.id,
      componentName: component.model,
      specsUrl: component.sources.specsUrl,
      specsValid: specsResult.valid,
      specsError: specsResult.valid ? undefined : specsResult.error,
      priceUrl: component.sources.priceUrl,
      priceValid: priceResult.valid,
      priceError: priceResult.valid ? undefined : priceResult.error,
    };

    results.push(result);

    // Log resultado inmediato
    if (specsResult.valid && priceResult.valid) {
      console.log(`✅ ${component.model}: URLs válidas`);
    } else {
      console.log(`❌ ${component.model}: Errores detectados`);
      if (!specsResult.valid) {
        console.log(`   - Specs: ${specsResult.error}`);
      }
      if (!priceResult.valid) {
        console.log(`   - Price: ${priceResult.error}`);
      }
    }
  }

  return results;
}

function generateReport(results: ValidationResult[]): void {
  console.log("\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log("  REPORTE DE VALIDACIÓN - PHASE 4 DATASET SEED");
  console.log("═══════════════════════════════════════════════════════");
  console.log("");

  const totalComponents = results.length;
  const validComponents = results.filter(
    (r) => r.specsValid && r.priceValid
  ).length;
  const invalidComponents = totalComponents - validComponents;

  console.log(`📊 RESUMEN:`);
  console.log(`   Total de componentes: ${totalComponents}`);
  console.log(`   ✅ Válidos: ${validComponents}`);
  console.log(`   ❌ Con errores: ${invalidComponents}`);
  console.log("");

  if (invalidComponents > 0) {
    console.log("❌ COMPONENTES CON ERRORES:");
    console.log("");

    results
      .filter((r) => !r.specsValid || !r.priceValid)
      .forEach((result) => {
        console.log(`🔴 ${result.componentName} (${result.componentId})`);

        if (!result.specsValid) {
          console.log(`   ❌ Specs URL: ${result.specsError}`);
          console.log(`      ${result.specsUrl}`);
        }

        if (!result.priceValid) {
          console.log(`   ❌ Price URL: ${result.priceError}`);
          console.log(`      ${result.priceUrl}`);
        }

        console.log("");
      });
  }

  console.log("✅ COMPONENTES VÁLIDOS:");
  console.log("");

  results
    .filter((r) => r.specsValid && r.priceValid)
    .forEach((result) => {
      console.log(`🟢 ${result.componentName}`);
      console.log(`   ✅ Specs: ${result.specsUrl}`);
      console.log(`   ✅ Price: ${result.priceUrl}`);
      console.log("");
    });

  console.log("═══════════════════════════════════════════════════════");
  console.log("");

  if (invalidComponents === 0) {
    console.log("🎉 ¡VALIDACIÓN EXITOSA!");
    console.log("   Todos los componentes tienen URLs válidas.");
  } else {
    console.log("⚠️  VALIDACIÓN FALLIDA");
    console.log(`   ${invalidComponents} componente(s) con URLs inválidas.`);
    console.log("   Revisa los errores arriba y corrige las URLs.");
  }

  console.log("");
  console.log("═══════════════════════════════════════════════════════");
}

// Ejecutar validación
async function main() {
  console.log("🚀 Iniciando validación del dataset seed...\n");

  const results = await validateAllComponents();
  generateReport(results);

  // Exit code basado en resultado
  const hasErrors = results.some((r) => !r.specsValid || !r.priceValid);
  process.exit(hasErrors ? 1 : 0);
}

main().catch((error) => {
  console.error("💥 Error fatal durante la validación:");
  console.error(error);
  process.exit(1);
});
