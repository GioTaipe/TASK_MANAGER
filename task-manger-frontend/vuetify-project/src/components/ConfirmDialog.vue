<template>
    <v-dialog v-model="showDialog" max-width="600px">
        <v-card>
        <v-card-title>
            <span class="headline">Confirm</span>
        </v-card-title>
        <v-card-text>
            <span>{{ message }}</span>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="handleCancel">Cancel</v-btn>
            <v-btn color="green" text @click="handleConfirm">Confirm</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'ConfirmDialog',
    props: {
        message: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showDialog: true,
        };
    },
    methods: {
        handleCancel() {
            this.showDialog = false;
            this.$emit('cancel');
        },
        handleConfirm() {
            this.showDialog = false;
            this.$emit('confirm');
        },
    },
};
</script>