export class CollectionBlackList {
  private static blackList: string[] =
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? [
          "0x2a6c77a2731bc076409c9c702783a4e69fe85b96",
          "0x33893bccc931c06fcb1fbd2774537efa40ef8fc1",
          "0x3cd5c3aa51e77f452b4ba30d6e9860197ad787ba",
          "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
          "0xb34381d63865aaec787f54e7a00a98ef46b21932",
          "0xbdb979e652237f5162420dd5ca0c0c0378815c14",
          "0xc8f27287373061c993cd9f73f7a4ce87eb1002e7",
          "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
          "0xe9ee190f98af25616d8cd1928a7da2ea3a5c252d",
        ]
      : [
          "0x0fb63a3666bf6078d0beb546ea82cb39d85a3b55",
          "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          "0x97db46391601c3400865e6fc212be4cc85da58b4",
          "0x9d2ea01c8231c020b8a06bd2c8f6928ffdf11eb9",
          "0xa1c0038e93f7575f36b6e29c4f26467e9a46f350",
          "0xa701f859e25e8cddf8e03377276925a9ac1610fb",
          "0xaf715db4f52554279dfd74c22efba52c35557e83",
          "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          "0xd4dfd66564b592b0d59906192c9a7782f79ca843",
          "0xdbfd1709d40760e6ab330cdd0bbe12ff5e0b1f56",
        ];
  static isBlocked(address: string): boolean {
    return this.blackList.indexOf(address) != -1;
  }
}

export class TokenBlackList {
  private static blackList: { collection: string; tokenId: string }[] =
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? [
          {
            collection: "0x33893bccc931c06fcb1fbd2774537efa40ef8fc1",
            tokenId: "1",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "1",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "10",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "2",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "3",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "4",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "5",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "6",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "7",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "8",
          },
          {
            collection: "0x3fe4d692e67073a66c280766fe787a74b0cc613c",
            tokenId: "9",
          },
          {
            collection: "0xb34381d63865aaec787f54e7a00a98ef46b21932",
            tokenId: "1",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "1",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "10",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "11",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "12",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "13",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "14",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "15",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "16",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "17",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "2",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "3",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "4",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "5",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "6",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "7",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "8",
          },
          {
            collection: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
            tokenId: "9",
          },
        ]
      : [
          {
            tokenId: "1",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "2",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "3",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "4",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "5",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "6",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "7",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "8",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "9",
            collection: "0x4c971b621e15dc8abfc03ce3dcccf6cb63a848ae",
          },
          {
            tokenId: "1",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "10",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "11",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "12",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "13",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "14",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "15",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "16",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "17",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "18",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "19",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "2",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "20",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "21",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "22",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "23",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "24",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "25",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "26",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "27",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "28",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "29",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "3",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "30",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "31",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "32",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "4",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "5",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "6",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "7",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "8",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "9",
            collection: "0x5740512e4e88dd0a80a3e9cf505ff72c4dce8f37",
          },
          {
            tokenId: "1",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "10",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "11",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "12",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "13",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "14",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "15",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "16",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "17",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "18",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "19",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "2",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "20",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "21",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "22",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "23",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "3",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "4",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "5",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "6",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "7",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "8",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "9",
            collection: "0x6dd0edf61b73acd04db22ff7e6976ad0054d06f0",
          },
          {
            tokenId: "1",
            collection: "0x97db46391601c3400865e6fc212be4cc85da58b4",
          },
          {
            tokenId: "2",
            collection: "0x97db46391601c3400865e6fc212be4cc85da58b4",
          },
          {
            tokenId: "3",
            collection: "0x97db46391601c3400865e6fc212be4cc85da58b4",
          },
          {
            tokenId: "4",
            collection: "0x97db46391601c3400865e6fc212be4cc85da58b4",
          },
          {
            tokenId: "5",
            collection: "0x97db46391601c3400865e6fc212be4cc85da58b4",
          },
          {
            tokenId: "6",
            collection: "0x97db46391601c3400865e6fc212be4cc85da58b4",
          },
          {
            tokenId: "1",
            collection: "0x9d2ea01c8231c020b8a06bd2c8f6928ffdf11eb9",
          },
          {
            tokenId: "1",
            collection: "0xa701f859e25e8cddf8e03377276925a9ac1610fb",
          },
          {
            tokenId: "2",
            collection: "0xa701f859e25e8cddf8e03377276925a9ac1610fb",
          },
          {
            tokenId: "1",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "2",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "3",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "4",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "5",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "6",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "7",
            collection: "0xcb2a1c8b1191917d2e0abca3bb4bf7c85350b046",
          },
          {
            tokenId: "1",
            collection: "0xd4dfd66564b592b0d59906192c9a7782f79ca843",
          },
        ];

  static isBlocked(address: string, tokenId: number): boolean {
    return (
      this.blackList.findIndex(
        (e) => e.collection == address && +e.tokenId == tokenId
      ) != -1
    );
  }
}
