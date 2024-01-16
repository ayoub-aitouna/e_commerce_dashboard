import es from "./es";
import en from "./en";
import fr from "./fr";
import de from "./de";
import nl from "./nl";
import it from "./it";

export { es, en, fr, de, nl, it };

export enum languageEnum {
    English = "en",
    French = "fr",
    German = "de",
    Italy = "it",
    Espagnol = "es",
    Dutch = "nl",

}


export const languageSettings: Record<languageEnum, any> = {
    en: en,
    fr: fr,
    de: de,
    it: it,
    es: es,
    nl: nl,
};

