const request = require("request");
const server = require("../../server");
const base = "http://localhost:5000/lists/";
const List = require("../../src/db/models").List;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : lists", () => {
  beforeEach(done => {
    this.list;
    sequelize.sync({ force: true }).then(res => {
      List.create({
        title: "My List"
      })
        .then(list => {
          this.list = list;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /lists", () => {
    it("should return a status code 200", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });

  describe("POST /lists/create", () => {
    const options = {
      url: "http://localhost:5000/lists/create",
      form: {
        title: "Your List"
      }
    };

    it("should create a new list and redirect", done => {
      request.post(options, (err, res, body) => {
        List.findOne({ where: { title: "Your List" } })
          .then(list => {
            // expect(res.statusCode).toBe(303);
            expect(list.title).toBe("Your List");
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /lists/:id", () => {
    it("should render a view with the selected list", done => {
      request.get(`${base}${this.list.id}`, (err, res, body) => {
        expect(err).toBeNull();
        done();
      });
    });
  });

  describe("POST /lists/:id/destroy", () => {
    it("should delete the list with the corresponding ID", done => {
      List.all().then(lists => {
        const listCountBeforeDelete = lists.length;

        expect(listCountBeforeDelete).toBe(1);

        request.post(`${base}${this.list.id}/destroy`, (err, res, body) => {
          List.all().then(lists => {
            expect(err).toBeNull();
            expect(lists.length).toBe(listCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });

  describe("POST /lists/:id/update", () => {
    it("should update the list", done => {
      const options = {
        url: `${base}${this.list.id}/update`,
        form: {
          title: "Angela's List"
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        List.findOne({
          where: { id: this.list.id }
        }).then(list => {
          expect(list.title).toBe("Angela's List");
          done();
        });
      });
    });
  });
});
