export function translateAuthError(message: string | undefined): string {
  switch (message) {
    case "Invalid login credentials":
      return "Feil e-post eller passord.";
    case "Email not confirmed":
      return "E-posten din er ikke bekreftet ennå. Sjekk innboksen din for bekreftelseslenken vi sendte deg.";
    case "User already registered":
      return "Det finnes allerede en konto med denne e-postadressen.";
    default:
      return message || "Noe gikk galt. Prøv igjen.";
  }
}
