const faker = require("faker");
const _ = require("lodash");
faker.locale = "en";

module.exports = {
    customer: _.times(20, function (n) {
        return {
            id: n,
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            avatar: faker.internet.avatar()
        }
    }),
    home: _.times(10, function (n) {
        return {
            id: n,
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            avatar: faker.internet.avatar()
        }
    }),
}