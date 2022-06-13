wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { book: [] };
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (requestObject.method) {
    case 'storeAddress':
      state.book.push({
        name: requestObject.nameToStore,
        address: requestObject.addressToStore,
      });
      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
      return true;
    case 'retrieveAddresses':
      return state.book;
    case 'hello':
      let address_book = state.book
        .map(function (item) {
          return `${item.name}: ${item.address}`;
        })
        .join('\n');
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description: 'Address book:',
            textAreaContent: address_book,
          },
        ],
      });
    case 'clearTestData':
      await wallet.request({
        method: 'snap_manageState',
        params: ['clear'],
      });
    default:
      throw new Error('Method not found.');
  }
});
