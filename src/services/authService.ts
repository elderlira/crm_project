import api from "./api"

export const login = async (email: string, password: string) => {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      if (email === "admin@email.com" && password === "123456") {

        resolve({
          token: "fake-jwt-token",
          user: {
            name: "Admin",
            email: email
          }
        })

      } else {
        reject("Email ou senha inválidos")
      }

    }, 1000)

  })
}