import parsePhoneNumber from 'libphonenumber-js'

export function parseWhatsAppNumber(raw: string) {
  const phone = parsePhoneNumber("+" + raw);

  return {
    country: phone?.country || null,
    countryCallingCode: phone?.countryCallingCode || null,
    nationalNumber: phone?.nationalNumber || null,
    formattedInternational: phone?.formatInternational() || null,
    formattedNational: phone?.formatNational() || null,
  };
}