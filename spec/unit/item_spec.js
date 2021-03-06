const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("Item()", () => {
  beforeEach(done => {
    this.list;
    this.item;
    sequelize.sync({ force: true }).then(res => {
      List.create({
        title: "My List"
      })
        .then(list => {
          this.list = list;

          Item.create({
            description: "1 quart of orange juice",
            purchased: false,
            listId: this.list.id
          }).then(item => {
            this.item = item;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#create", () => {
    it("should create an item with a description, purchased status, and assigned list", done => {
      Item.create({
        description: "5 loaves of bread",
        purchased: false,
        listId: this.list.id
      })
        .then(item => {
          expect(item.description).toBe("5 loaves of bread");
          expect(item.purchased).toBe(false);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should not create an item without a description, purchased status or assigned list", done => {
      Item.create({
        description: "",
        purchased: true,
        listId: this.list.id
      })
        .then(item => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Item description cannot be null");
          done();
        });
    });
  });

  describe("#setList()", () => {
    it("should associate a list and a item together", done => {
      List.create({
        title: "Lee's List"
      }).then(newList => {
        expect(this.item.listId).toBe(this.list.id);

        this.item.setList(newList).then(item => {
          expect(item.listId).toBe(newList.id);
          done();
        });
      });
    });
  });

  describe("#getList()", () => {
    it("should return the associated list", done => {
      this.item.getList().then(associatedList => {
        expect(associatedList.title).toBe("My List");
        done();
      });
    });
  });
});
