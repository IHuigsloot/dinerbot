<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-img
          v-bind="attrs"
          v-on="on"
          :src="image"
          class="rounded"
          max-height="450"
          max-width="450"
        ></v-img>
      </template>

      <v-card>
        <v-card-title> Afbeeldingen instellen </v-card-title>

        <v-card-text v-if="!isUploading">
          <v-img :src="this.image" class="rounded"></v-img>
          <v-btn
            v-if="!disabled"
            @click="$refs.file.click()"
            class="mt-2 mx-auto"
            color="primary"
          >
            <input
              type="file"
              ref="file"
              @change="uploadImage($event)"
              accept="image/*"
            />Nieuwe afbeelding
          </v-btn>
        </v-card-text>

        <v-card-text v-else>
          <cropper
            ref="cropper"
            class="cropper"
            :src="previewImage"
            :stencil-props="{
              aspectRatio: 10 / 10,
            }"
          />
          <v-row align="center" justify="space-around" class="mt-2">
            <v-btn @click="isUploading = false" color="primary">
              Oude afbeelding behouden
            </v-btn>
            <v-btn @click="setImage()" color="success"> Opslaan </v-btn>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> Sluiten </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";

export default {
  components: { Cropper },
  props: [
    'image',
    'disabled'
  ],

  data() {
    return {
      dialog: false,
      previewImage: null,
      isUploading: false,
    };
  },
  methods: {
    uploadImage(event) {
      this.isUploading = true;
      const input = event.target;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    setImage() {
      const { canvas } = this.$refs.cropper.getResult();
      const image = canvas.toDataURL();
      this.$emit('photo-change', image);
      this.isUploading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.imagePreviewWrapper {
  width: 250px;
  height: 250px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
}
.v-btn input {
  display: none;
}
</style>
