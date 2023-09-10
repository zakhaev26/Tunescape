# Routes

### /upload [POST]

    The response must contain :
        1. Music File (name: "music")
        2. Thumbnail Image file (name: "thumbnail");
        3. Song Information (
            body: {
                music: {
                    title: "title-input",
                    artist: "artist-input",
                    user: "username",
                    uid: "uid-from-firebase"

                }
            }

        )
