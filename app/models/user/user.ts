/* eslint-disable no-cond-assign */
import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import Firebase from './../../config/Firebase';
import { save, load } from "../../utils/storage";


/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    email: types.maybe(types.string),
    password: types.maybe(types.string),
    status: types.maybe(types.string),
    isAuthenticated: types.optional(types.boolean, false),

  }).actions(self =>({
    setAuthenticated(value: boolean) {
      self.isAuthenticated = value
    },
    setEmail(newEmail: string) {
      self.email = newEmail
  },
  setPassword(newPassword: string) {
    self.password = newPassword
  },
}))
  .actions((self) => ({
    login: flow(function*() {
      self.setAuthenticated(true)
       /* Firebase.auth().signInWithEmailAndPassword(self.email, self.password)
        .then((userCredential) => {
          // Signed in 
          // save(self.email, self.password)
          // self.email = ""
          // self.password = ""
        })
        .catch((error) => {
          self.status = error.message;
          // ..
        }); */
      }),
    logout: flow(function*() {
      Firebase.auth().signOut().then(() => {
        // Sign-out successful.
        self.setAuthenticated(false)
      }).catch((error) => {
        self.status = error.message;
      });
    }),
    register: flow(function*() {
      try {
        Firebase.auth().createUserWithEmailAndPassword(self.email, self.password)
      } catch (err) {
        self.status=err.message;
      }
    }),
  }))

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
