// import { injected } from "brandi";
// import { instancesToken } from "../dependency-injection";
// import { IUserState } from "src/stores/user/model";
// import { useUserStore } from "src/stores/user";
// import { Me, User, UserSettings } from "src/common/types/user";
// import { AxiosService } from "../axios/service";
// import { areStringsEquals } from "src/common/utils/string-extention-methods";
// import { RouteName } from "src/common/enum/route-name.enum";
// import {
//   CatchError,
//   CatchErrorAsync,
// } from "src/common/helpers/decorators/catch-error.decorator";
// import { ProfileMentionsTagsSettingOptionEnum } from "src/components/profile/form/enum";

// const UPDATE_TIME = 86_400_000;

// export class UserService {
//   private userStore: IUserState;
//   constructor(private readonly httpService: AxiosService) {
//     this.userStore = useUserStore();
//   }

//   @CatchErrorAsync()
//   async getMe(forceUpdate?: boolean): Promise<Me> {
//     let me = this.getCurrentUser();
//     const needsToUpdate = this.needsToUpdate(
//       this.userStore.state.currentUserLastUpdateTime
//     );
//     if (me && !forceUpdate && !needsToUpdate) {
//       return me;
//     }

//     me = await this.getMeRequest();
//     this.setCurrentUser(me);

//     return me;
//   }

//   @CatchErrorAsync()
//   async getUsers(userAddresses: string[]): Promise<User[]> {
//     if (!userAddresses?.length) {
//       return [];
//     }

//     const existUsers = this.getStoreUsers(userAddresses);
//     const needToFetchUsers = userAddresses.filter(
//       (e) => existUsers.findIndex((s) => areStringsEquals(e, s._id)) === -1
//     );

//     if (!needToFetchUsers?.length) {
//       return existUsers;
//     }

//     const newlyFetchedUsers = await this.getUsersRequest(needToFetchUsers);
//     this.setStoreUsers(newlyFetchedUsers);

//     return [...newlyFetchedUsers, ...existUsers];
//   }

//   @CatchErrorAsync()
//   async getMeRequest(): Promise<Me> {
//     const response = await this.httpService.getByName(RouteName.GET_ME, null);

//     return response.data;
//   }

//   @CatchErrorAsync()
//   async getUsersRequest(users: string[]): Promise<User[]> {
//     const res = await this.httpService.getByName(RouteName.GET_USERS, {
//       users,
//     });

//     return res.data.users;
//   }

//   @CatchError()
//   resetUserCache(): void {
//     this.userStore.state.users = [];
//   }

//   @CatchError()
//   setCurrentUser(user: Me): void {
//     this.userStore.state.currentUser = user;
//     this.userStore.state.currentUserLastUpdateTime = +new Date();
//   }

//   @CatchError()
//   getHasNotify(): boolean {
//     return this.userStore.state?.currentUser?.has_seen_notifications_page;
//   }

//   getCurrentUser(): Me {
//     return this.userStore.state.currentUser;
//   }

//   @CatchErrorAsync()
//   async updateUserSettings(settings: UserSettings): Promise<UserSettings> {
//     await this.updateCookieConsent(settings.consent_given);
//     await this.updateMentionSetting(settings.mention_permission);

//     return this.getUserSettings();
//   }

//   @CatchErrorAsync()
//   async getUserSettings(): Promise<UserSettings> {
//     const mentionSettings = await this.httpService.getByName(
//       RouteName.GET_USER_MENTION_SETTINGS,
//       {}
//     );

//     const { cookies_consent } = await this.getMe(true);
//     const result = {
//       mention_permission: null,
//       consent_given: cookies_consent.consent_given,
//     };
//     result.mention_permission = mentionSettings.data.mention_permission;

//     return result;
//   }

//   private async updateCookieConsent(consent_given: boolean): Promise<void> {
//     await this.httpService.patchByName(
//       RouteName.UPDATE_COOKIE_CONSENT,
//       {},
//       { consent_given }
//     );
//   }
//   private async updateMentionSetting(
//     value: ProfileMentionsTagsSettingOptionEnum
//   ): Promise<void> {
//     await this.httpService.patchByName(
//       RouteName.UPDATE_MENTION_PERMISSION,
//       {},
//       { mention_permission: value }
//     );
//   }
//   private setStoreUsers(users: User[]): void {
//     const storeUsers = this.getStoreUsers();

//     const nonDuplicatedUsers = storeUsers.filter(
//       (e) => users.findIndex((s) => areStringsEquals(e._id, s._id)) === -1
//     );

//     const newUsers = [...nonDuplicatedUsers, ...users];
//     this.userStore.state.users = newUsers;
//   }
//   private getStoreUsers(filter?: string[]): User[] {
//     if (!filter?.length) {
//       return this.userStore.state.users;
//     }

//     filter = filter.map((e) => e.toLowerCase());

//     return this.userStore.state.users.filter(
//       (e) => filter.indexOf(e._id.toLowerCase()) !== -1
//     );
//   }
//   private needsToUpdate(latestUpdateTime: number): boolean {
//     return +new Date() - latestUpdateTime > UPDATE_TIME;
//   }
// }

// injected(UserService, instancesToken.axiosService as any);
