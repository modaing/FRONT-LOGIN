class ProposalForm {
    constructor(isAdmin = false, memberId = 192192) {
        this.isAdmin = isAdmin;
        this.memberId = memberId;
        this.form = document.createElement('form');
        this.form.name = "WriteFrm";
        this.form.method = "post";

        // Hidden Inputs
        const hiddenInputs = [
            { name: "memoPost.cafeId", value: "11029649" },
            { name: "memoPost.menuId", value: "121" },
            { name: "memoPost.userId", value: memberId },
            { name: "memoPost.emotion", id: "emotion", value: "11" }
        ];

        hiddenInputs.forEach(inputData => {
            const input = document.createElement('input');
            input.type = "hidden";
            input.name = inputData.name;
            input.value = inputData.value;
            if (inputData.id) input.id = inputData.id;
            this.form.appendChild(input);
        });

        // Textarea
        this.textarea = document.createElement('textarea');
        this.textarea.id = "contents";
        this.textarea.name = "memoPost.content";
        this.textarea.className = "tf_write";
        this.textarea.placeholder = "글을 입력해 주세요.";
        this.form.appendChild(this.textarea);

        // Submit Button
        const submitButton = document.createElement('button');
        submitButton.type = "submit";
        submitButton.textContent = "등록";
        this.form.appendChild(submitButton);
    }

    render() {
        return this.form;
    }
}
