import Realm from 'realm';
export const DIE_SCHEMA = "Die";
export const DAS_SCHEMA = "Das";
export const DER_SCHEMA = "Der";

// Define your models and their properties
export const DieSchema = {
  name: DIE_SCHEMA,
  primaryKey: 'id',
  properties:
  {
    id: { type: 'int', default: 0 },
    name: 'string',
    translation: 'string'
  }
};
export const DasSchema = {
  name: DAS_SCHEMA,
  primaryKey: 'id',
  properties:
  {
    id: { type: 'int', default: 0 },
    name: 'string',
    translation: 'string'
  }
};
export const DerSchema = {
  name: DER_SCHEMA,
  primaryKey: 'id',
  properties:
  {
    id: { type: 'int', default: 0 },
    name: 'string',
    translation: 'string'
  }
};

const databaseOptions = {
  path: 'German.realm',
  schema: [DieSchema, DasSchema, DerSchema],
  schemaVersion: 0, //optional    
};
//functions for TodoLists
export const insertNewWord = (newWord, type) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      if (type === 'Die') {
        realm.create(DIE_SCHEMA, newWord);
      } else if (type === 'Das') {
        realm.create(DAS_SCHEMA, newWord);
      } else if (type === 'Der') {
        realm.create(DER_SCHEMA, newWord);
      }
      resolve(newWord);
    });
  }).catch((error) => reject(error));
});


export const deleteWord = (id, type) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      if (type === 'Die') {
        let deletingProduct = realm.objectForPrimaryKey(DIE_SCHEMA, id);
        realm.delete(deletingProduct);
      } else if (type === 'Das') {
        let deletingProduct = realm.objectForPrimaryKey(DAS_SCHEMA, id);
        realm.delete(deletingProduct);
      } else if (type === 'Der') {
        let deletingProduct = realm.objectForPrimaryKey(DER_SCHEMA, id);
        realm.delete(deletingProduct);
      }
      resolve();
    });
  }).catch((error) => reject(error));;
});

export const queryAllWords = (type) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    let allProducts;
    if (type === 'Die') {
      allProducts = realm.objects(DIE_SCHEMA);
    } else if (type === 'Das') {
      allProducts = realm.objects(DAS_SCHEMA);
    } else if (type === 'Der') {
      allProducts = realm.objects(DER_SCHEMA);
    }
    resolve(allProducts);
  }).catch((error) => {
    reject(error);
  });;
});
export default new Realm(databaseOptions);