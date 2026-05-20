// Shared Auckland Editorial Pricing Calculator

export function calculateTotalPrice(
  serviceSlug: string,
  bedrooms: number = 2,
  bathrooms: number = 1,
  extraServices: string[] = []
) {
  let basePrice = 0;

  // Primary service pricing catalog
  if (serviceSlug === "residential-cleaning" || serviceSlug === "res-clean-fallback") {
    if (bedrooms === 2) {
      basePrice = 320; // 2-Bedroom fixed rate
    } else if (bedrooms === 3) {
      basePrice = 400; // 3-Bedroom fixed rate (includes 2 bathrooms)
    } else {
      // General estimate based on hourly rate ($40/hr)
      basePrice = 120 + (bedrooms - 2) * 50 + (bathrooms - 1) * 35;
    }
  } else if (serviceSlug === "deep-cleaning" || serviceSlug === "move-in-move-out-cleaning") {
    basePrice = 320; // Starting at $320
    if (bedrooms > 2) basePrice += (bedrooms - 2) * 60;
    if (bathrooms > 1) basePrice += (bathrooms - 1) * 45;
  } else if (serviceSlug === "commercial-cleaning") {
    basePrice = 180; // $45/hr base (4 hours estimation)
    if (bedrooms > 2) basePrice += (bedrooms - 2) * 45;
  } else if (serviceSlug === "carpet-cleaning") {
    basePrice = 250; // $250 for 2-bedroom standard
    if (bedrooms > 2) basePrice += (bedrooms - 2) * 40;
  } else if (serviceSlug === "post-construction-cleaning") {
    basePrice = 400; // Starting at $400
    if (bedrooms > 2) basePrice += (bedrooms - 2) * 80;
    if (bathrooms > 1) basePrice += (bathrooms - 1) * 50;
  } else {
    basePrice = 160; // General fall-back
  }

  // Add-on services
  extraServices.forEach((addOn) => {
    if (addOn === "Oven Cleaning") {
      basePrice += 67; // $67 + GST
    } else if (addOn === "Carpet Cleaning") {
      basePrice += 250; // $250 + GST
    }
  });

  const gst = basePrice * 0.15; // 15% GST in New Zealand
  const total = basePrice + gst;

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
