<template>
  <v-container>
    <v-row>
      <v-col cols="7">
        <h1>Nieuw restaurant</h1>
      </v-col>
      <v-col cols="5">
        <v-row justify="end" v-if="!isEditing">
          <v-btn color="primary" @click="isEditing = true">Bewerken</v-btn>
        </v-row>
        <v-row justify="end" v-else>
          <v-btn color="warning" @click="cancelEdit" v-if="!!restaurantId"
            >Annuleren</v-btn
          >
          <v-btn color="success" @click="save" class="ml-2">Opslaan</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="px-4 py-2" outlined>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="headline">
                Basis informatie
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-row>
              <v-col cols="8">
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    :class="{ readonly: !isEditing }"
                    v-model="name"
                    :rules="nameRules"
                    label="Name restaurant"
                  ></v-text-field>

                  <v-combobox
                    :class="{ readonly: !isEditing }"
                    v-model="tags"
                    :rules="tagsRules"
                    multiple
                    label="Tags"
                    append-icon
                    chips
                    :deletable-chips="isEditing"
                    :search-input.sync="tagsSearch"
                    @keyup.tab="updateTags"
                    @paste="updateTags"
                  ></v-combobox>
                </v-form>
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="3">
                <ImageUpload
                  :image="image"
                  :disabled="!isEditing"
                  v-on:photo-change="changeImage($event)"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import { dataURLtoBlob } from "@/helpers";
import axios from "axios";

export default {
  components: {
    ImageUpload
  },

  data() {
    return {
      valid: true,
      restaurantId: null,
      isEditing: false,
      name: "",
      image:
        "https://media-cdn.tripadvisor.com/media/photo-s/09/5c/46/b0/domino-s-pizza-milnerton.jpg",
      isImageChanged: false,
      tags: [],
      tagsSearch: "",
      nameRules: [v => !!v || "Naam is verplicht"],
      tagsRules: [v => (v && v.length > 0) || "Moet ten minste 1 tag bevatten"]
    };
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    updateTags() {
      this.$nextTick(() => {
        if (!this.tagsSearch) {
          return;
        }
        this.tags.push(...this.tagsSearch.split(","));
        this.$nextTick(() => {
          this.tagsSearch = "";
        });
      });
    },

    fetchData() {
      const restaurantId = this.$route.params.id;
      this.restaurantId = restaurantId;
      if (!restaurantId) {
        this.isEditing = true;
        return;
      }
      axios
        .get("http://localhost:3000/restaurants/" + restaurantId)
        .then(res => {
          const data = res.data;
          this.name = data.name;
          this.tags = data.tags;
          this.image = `http://localhost:3000/restaurants/${this.restaurantId}/logo`;
        });
    },

    save() {
      this.$refs.form.validate();
      setTimeout(() => {
        const { name, tags, valid } = this;

        if (!valid) {
          return;
        }

        const body = new FormData();
        body.append("name", name);
        for(let i = 0; i < tags.length; i++) {
          body.append("tags[]", tags[i]);
        }

        if (this.isImageChanged) {
          const blob = dataURLtoBlob(this.image);
          body.append("image", blob);
        }

        if (this.restaurantId) {
          axios
            .put(
              `http://localhost:3000/restaurants/${this.restaurantId}`,
              body,
              {
                headers: { "Content-Type": "multipart/form-data" }
              }
            )
            .then(() => {
              this.isEditing = false;
            });
        } else {
          axios
            .post("http://localhost:3000/restaurants/", body, {
              headers: { "Content-Type": "multipart/form-data" }
            })
            .then(res => {
              this.isEditing = false;
              const id = res.data._id;
              this.$router.push(id);
            });
        }
      }, 1);
    },

    cancelEdit() {
      this.$refs.form.resetValidation();
      this.isEditing = false;
      this.fetchData();
      this.isImageChanged = false;
    },

    changeImage(image) {
      this.image = image;
      this.isImageChanged = true;
    }
  }
};
</script>

<style lang="scss">
.readonly {
  pointer-events: none;
}
.brand-logo {
  position: relative;
}
.brand-logo .after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  color: #fff;
}
.brand-logo:hover .after {
  display: block;
  background: rgba(0, 0, 0, 0.6);
}
</style>
