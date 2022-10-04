const fs = require("fs");

class Container {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async save(information) {
    try {
      let content = await fs.promises.readFile(`./${this.fileName}`, "utf-8");
      if (content.length === 0 || content.length === 3) {
        information.id = 1;
        await fs.promises.writeFile(
          `./${this.fileName}`,
          JSON.stringify([information])
        );
        let id = information.id;
        return id;
      } else if (content.length !== 0) {
        try {
          var contentJson = JSON.parse(content);
        } catch (error) {
          throw new Error(
            'Verificar que el archivo "products.json" no tenga espacios ni saltos de linea'
          );
        }
        let lastIndex = contentJson.length - 1;
        let lastId = contentJson[lastIndex].id;
        information.id = lastId + 1;
        let id = information.id;
        contentJson.push(information);
        await fs.promises.writeFile(
          `./${this.fileName}`,
          JSON.stringify(contentJson)
        );
        return id;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      let content = await fs.promises.readFile(`./${this.fileName}`, "utf-8");
      let contentJson = JSON.parse(content);
      let contentExtractedFromArray;
      contentJson.forEach((element) => {
        if (element.id == id) {
          contentExtractedFromArray = element;
        }
      });
      let contentFinal = contentExtractedFromArray
        ? contentExtractedFromArray
        : null;
      return contentFinal;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      let content = await fs.promises.readFile(`./${this.fileName}`, "utf-8");
      return content;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      let content = await fs.promises.readFile(`./${this.fileName}`, "utf-8");
      let contentJson = JSON.parse(content);
      let contentFilteredById = [];
      contentJson.map((element) => {
        if (element.id != id) {
          contentFilteredById.push(element);
        }
      });
      await fs.promises.writeFile(
        `./${this.fileName}`,
        JSON.stringify(contentFilteredById)
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Container;
