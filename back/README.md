

# AJOUTS nécessaires au front

- création de la class ``UserPasswordChanging`` au fichier `user.input.ts` permettant de caractériser les données du
  chagenemr de password
- separation de la methode `updateById` du service `user` en `updateByIdWithoutPasswordChanging` et `updatePasswordById`