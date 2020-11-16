# Custom ShareX uploader

## I. Configuration du projet

Version minimale de NodeJS : 14.8.0

Le fichier `config.json.dist` doit être copié, renommé en `config.json` et rempli avec les valeurs suivantes :

```json
{
  "port": "Port sur lequel se lancera l'application",
  "url": "URL publique racine de l'application (sans le \"/\" final)",
  "uploadDir": "Chemin absolu du dossier où seront envoyés les images"
}
```

## II. Configuration ShareX

Tout d'abord, sélectionner l'uploader custom en sélectionnant `Destinations => Image uploader => Custom image uploader`

Ensuite, configurer l'uploader en utilisant le menu `Destinations => Custom uploader settings => "New"`

Les valeurs suivantes seront à rentrer :

- Onglet __Request__ :
  - __Method__ : _POST_
  - __URL__ : _URL de l'API_
  - __Body__ : Form data (multipart/form-data) (Aucune valeur ne sera à spécifier)
  - __File form name__ : _img_
- Onglet __Response__ :
  - __JsonPath__ : _link_ (Puis cliquer sur "Add syntax to URL field")

Une fois les valeurs renseignées, tester en cliquant sur le bouton "Test" de l'__Image uploader__ et
vérifier que dans l'onglet "Test", le retour est au format `URL: https://i.example.com/abc123`

## III. Features à implémenter

- Expiration des fichiers
