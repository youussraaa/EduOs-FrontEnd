export class Annee {
  Ann_Id: string;
  Ann_Nom: string;
  Ann_Description?: string;
  Ann_Datedebut?: string;
  Ann_Datefin?: string;
  Ann_Encours?: string;
}
export class Sexe {
  Sex_Id: string;
  Sex_Nom: string;
  Sex_Description?: string;
}
export class Niveau {
  Niv_Id: string;
  Ecole_Id: string;
  Niv_Nom: string;
  Niv_Description?: string;
}
export class Semestre {
  Sms_Id: string;
  Sms_Nom: string;
  Sms_Description?: string;
}
export class Trimestre {
  Trm_Id: string;
  Trm_Nom: string;
  Trm_Description?: string;
}
export class SemestreNiveau {
  SmsNiv_Id: string;
  Niv_Id: string;
  Sms_Id: string;
}
export class Classe {
  Cls_Id: string;
  Niv_Id: string;
  Cls_Nom: string;
  Classe_Description?: string;
}
export class ClasseAnnee {
  ClsAnn_Id: string;
  Cls_Id: string;
  Ann_Id: string;
}

export class EcoleType {
  EcoleType_Id: string;
  EcoleType_Nom: string;
  EcoleType_Description?: string;
}

export class Ecole {
  Ecole_Id: string;
  EcoleType_Id: string;
  Ecole_Nom: string;
  Ecole_Adresse?: string;
  Ecole_Mail?: string;
  Ecole_Tel?: string;
  Ecole_Gsm?: string;
  Ecole_Description?: string;
  Ecole_Logo?: string;
  EcoleTypeIds?: string[]
}

export class Enseignant {
  Ens_Id: string;
  Ecole_Id: string;
  Sex_Id: string;
  Ens_Nom: string;
  Ens_Prenom: string;
  Ens_DateNaissance?: string;
  Ens_Photo?: string;
  Ens_CIN?: string;
  Ens_Adresse?: string;
  Ens_Tel?: string;
  Ens_DateRecrutement?: string;
  Ens_LieuNaissance?: string;
}
export class Matiere {
  Mat_Id: string;
  Niv_Id: string;
  Mat_Nom: string;
  Mat_Description?: string;
  Mat_Nbrcredit?: string;
  Mat_Nbrheure?: string;
  Mat_Timestamp?: string;
}
export class EnseignantMatiereClasse {
  EnsMatCls_Id: string;
  Ens_Id: string;
  Mat_Id: string;
  Cls_Id: string;
  EnsMat_Description?: string;
}

export class Etudiant {
  Etd_Id: string;
  Ecole_Id: string;
  Sex_Id: string;
  Etd_Nom: string;
  Etd_Prenom: string;
  Etd_Matricule: string;
  Etd_Photo?: string;
  Etd_DateNaissance?: string;
  Etd_LieuNaissance?: string;
  Etd_CIN?: string;
  Etd_Tel?: string;
  Etd_Mail?: string;
  Etd_Adresse?: string;
  Etd_Remarque?: string;
}
export class EtudiantClasse {
  EtdClasse_Id: string;
  Etd_Id: string;
  Cls_Id: string;
}
export class Tuteur {
  Tut_Id: string;
  Sex_Id: string;
  Tut_Nom: string;
  Tut_Prenom?: string;
  Tut_Adresse?: string;
  Tut_Tel?: string;
  Tut_Mail?: string;
  Tut_CIN?: string;
  Tut_Profession?: string;
}
export class EtudiantTuteur {
  EtdTuteur_Id: string;
  Etd_Id: string;
  Tut_Id: string;
  LienParente?: string;
}
export class Facturable {
  Fact_Id: string;
  Ecole_Id: string;
  Fact_Nom: string;
  Fact_Code: string;
  Fact_Description?: string;
  Fact_Timestamp?: string;
}
export class FicheFacturation {
  FichFact_Id: string;
  Ecole_Id: string;
  Niv_Id: string;
  Ann_Id: string;
  FichFact_Nom: string;
  FichFact_Description?: string;
}
export class FacturableFicheFacturation {
  FactFicheFact_Id: string;
  Fact_Id: string;
  FichFact_Id: string;
}
export class Versement {
  Vers_Id: string;
  FactFicheFact_Id: string;
  EtdClasse_Id: string;
  Vers_reference: string;
  Vers_Dateprevu?: string;
  Vers_Remise?: string;
  Vers_Montant?: string;
  Vers_Estregle?: string;
  Vers_Estdu?: string;
  Vers_Remarque?: string;
}
export class NiveauEcoleType {
  NivEcoleType_Id: string;
  EcoleType_Id: string;
  Niv_Id: string;
}
export class NiveauTrimestre {
  TrmNiv_Id: string;
  Trm_Id: string;
  Niv_Id: string;
}
export class Note {
  ETdNote: string;
  Mat_Id: string;
  Etd_Id: string;
  Note: string;
}
export class keycloakUser {
  id: string;
  attributes: any;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  username: string;
  userProfileMetadata: {
    attributes: any[];
  };
  FullName: string;
}
