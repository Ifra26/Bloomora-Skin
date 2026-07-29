const { firestore } = require('./firebase');

function collectionRef(collectionName) {
  return firestore.collection(collectionName);
}

function docRef(collectionName, id) {
  return collectionRef(collectionName).doc(id);
}

async function getAll(collectionName) {
  const snapshot = await collectionRef(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getDoc(collectionName, id) {
  const snapshot = await docRef(collectionName, id).get();
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

async function findOneByField(collectionName, field, value) {
  const snapshot = await collectionRef(collectionName).where(field, '==', value).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function queryByField(collectionName, field, op, value) {
  const snapshot = await collectionRef(collectionName).where(field, op, value).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function createDoc(collectionName, id, data) {
  await docRef(collectionName, id).set(data);
  return data;
}

async function updateDoc(collectionName, id, data) {
  await docRef(collectionName, id).update(data);
  return getDoc(collectionName, id);
}

async function deleteDoc(collectionName, id) {
  await docRef(collectionName, id).delete();
}

async function replaceCollection(collectionName, docs) {
  const collection = collectionRef(collectionName);
  const snapshot = await collection.get();
  const batch = firestore.batch();

  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  docs.forEach((doc) => batch.set(collection.doc(doc.id), doc));

  await batch.commit();
}

module.exports = {
  firestore,
  collectionRef,
  docRef,
  getAll,
  getDoc,
  findOneByField,
  queryByField,
  createDoc,
  updateDoc,
  deleteDoc,
  replaceCollection
};
