import { Injectable, inject } from '@angular/core';

import {
    addDoc,
    arrayRemove,
    arrayUnion,

    collection,
    collectionData,
    collectionGroup,
    deleteDoc,
    doc,
    docData,
    docSnapshots,
    DocumentSnapshot,
    DocumentData,
    DocumentReference,
    Firestore,
    orderBy,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
    getDocs,
    limit
} from '@angular/fire/firestore';
import { from, map, merge, Observable } from 'rxjs';

import { FirebaseError } from '@angular/fire/app';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor() { }

    firestore = inject(Firestore)


    async asyncCollection(collectionName): Promise<{ id: string }[]> {
        try {
            // Reference the collection
            const colRef = collection(this.firestore, collectionName);
            // Get the documents in the collection
            const querySnapshot = await getDocs(colRef);
            // Map the documents into an array
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return documents;
        } catch (error) {
            console.error("Error fetching collection:", error);
            throw error;
        }
    }


    addDoc(path: string, data: object): Promise<DocumentReference<object, DocumentData>> {
        const collectionRef = collection(this.firestore, path)
        return addDoc(collectionRef, data)
    }

    collection(path): Observable<any> {
        const collectionRef = collection(this.firestore, path)
        return collectionData(collectionRef, { idField: 'id' })
    }



    sortedCollection(path, sordtedBy, direction) {
        const collectionRef = collection(this.firestore, path)
        const q = query(collectionRef, orderBy(sordtedBy, direction))
        return collectionData(q, { idField: 'id' })
    }

    sortedCollectionQuery(criteria: any) {
        const collectionRef = collection(this.firestore, criteria.path)
        // const upcomingDatesQuery = collectionRef
        const upcomingOrPastShowsQuery = query(collectionRef, where(
            criteria.queryFieldname,
            criteria.queryOperator,
            criteria.queryCriterium))
        const orderedUpcomingOrPastShowsQuery = query(
            upcomingOrPastShowsQuery,
            orderBy(
                criteria.orderByFieldname,
                criteria.orderDirection
            )
        )
        return collectionData(orderedUpcomingOrPastShowsQuery, { idField: 'id' })
    }


    deleteDoc(path): Promise<void> {
        const docRef = doc(this.firestore, path)
        return deleteDoc(docRef);
    }
    updateDoc(path: string, value): Promise<void> {
        const docRef = doc(this.firestore, path)
        return updateDoc(docRef, value)
    }
    setDoc(path, object): Promise<void> {
        const docRef = doc(this.firestore, path);
        return setDoc(docRef, object)
    }
    getDoc(path): Observable<DocumentData> {
        const docRef = doc(this.firestore, path)
        return docData(docRef, { idField: 'id' })
    }

    async getDocAsync(path): Promise<DocumentData> {
        const docRef = doc(this.firestore, path)
        return docData(docRef)
    }

    findDoc(path, field, value) {
        const collectionRef = collection(this.firestore, path)
        const queryRef = query(collectionRef, where(field, '==', value))
        return collectionData(queryRef, { idField: 'id' })
    }

    removeElementFromArray(pathToDocument: string, arrayName: string, value: object | string): Promise<void> {
        const docRef = doc(this.firestore, pathToDocument)
        return updateDoc(docRef, {
            [arrayName]: arrayRemove(value)
        })
    }
    addElementToArray(pathToDocument: string, arrayName: string, value: object | string): Promise<void> {
        // // console.log(arrayName)
        const docRef = doc(this.firestore, pathToDocument);
        return updateDoc(docRef, {
            // spiritsArray: arrayUnion(spirit)
            [arrayName]: arrayUnion(value)
        })
    }
    addElementToArrayF(pathToDocument: string, arrayName: string, value: object): Promise<void> {
        // // console.log(pathToDocument)
        // // console.log(arrayName)
        const docRef = doc(this.firestore, pathToDocument);
        return setDoc(
            docRef,
            {
                [arrayName]: arrayUnion(value)
            },
            {
                merge: true
            },
        )
    }

    updateField(path: string, fieldName: string, newValue: unknown) {
        const docRef = doc(this.firestore, path);
        return updateDoc(docRef, { [fieldName]: newValue })
    }
    findCollectionArray(path, fieldName, value) {
        const collectionRef = collection(this.firestore, path)
        const q = query(collectionRef, where(fieldName, '==', value))
        return collectionData(q, { idField: 'id' })
    }

    // findDoc(path, field, value) {
    //     const collectionRef = collection(this.firestore, path)
    //     const queryRef = query(collectionRef, where(field, '==', value))
    //     return collectionData(queryRef, { idField: 'id' })
    // }
    getFieldInDocument(path, fieldName) {
        const promise = new Promise((resolve, reject) => {
            const docRef = doc(this.firestore, path)
            onSnapshot(docRef, (docSnapshots) => {
                if (docSnapshots.exists()) {
                    const data = docSnapshots.data()
                    // // console.log('Field value', data[fieldName])
                    resolve(data[fieldName])
                }
            })
        })
        return promise

    }

    getFieldValues(collectionName: string, fieldName: string): Observable<any[]> {
        const colRef = collection(this.firestore, collectionName); // Get collection reference
        return collectionData(colRef).pipe(
            map(docs => docs.map(doc => doc[fieldName])) // Extract only the specific field
        );
    }

    getFirstDocument(collectionName: string): Observable<any | null> {
        const colRef = collection(this.firestore, collectionName);
        const firstDocQuery = query(colRef, limit(1));

        return from(getDocs(firstDocQuery)).pipe(
            map(snapshot => snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null)
        );
    }
}
