import express from 'express'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const router = express.Router()

//CRUD for user

//GET  request
//returns all the users
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await User.find({})

    if (users) {
      res.status(200).json(users)
    } else {
      res.status(404)
      throw new Error('Users not found')
    }
  })
)

//POST request || Create request
//adds a new user
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, username, password } = req.body

    const userExists = await User.findOne({ username })
    if (userExists) {
      res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({
      name,
      username,
      password,
      categories: [{ name: 'misc', bookmarks: [] }],
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        password: user.password,
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  })
)

//GET  request || Read request
//returns a user based on the username
router.get(
  '/:username',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username })

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//get based on the userID
// router.get(
//   '/:userID',
//   asyncHandler(async (req, res) => {
//     const user = await User.findOneById(req.params.userID)

//     if (user) {
//       res.status(200).json(user)
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   })
// )

// PUT request || Update request
// updates an existing user
router.put(
  '/:userID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      user.name = req.body.name || user.name
      user.username = req.body.username || user.username
      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        password: updatedUser.password,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

// DELETE request || Delete request
// deletes a certain user
router.delete(
  '/:userID',
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userID)

    if (user) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        message: 'User deleted',
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//CRUD for categories

//GET  request
//returns all the categories of a certain user
router.get(
  '/:userID/categories',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)
    const categories = await user.categories

    if (categories) {
      res.status(200).json(categories)
    } else {
      res.status(404)
      throw new Error('Categories not found')
    }
  })
)

// POST request || Create request
// it is actually PUT requst, since we are creating a new category in the already available user
// creates a new category of a certain user
router.put(
  '/:userID/categories',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      user.categories.push({
        name: req.body.name,
        isPrivate: req.body.isPrivate,
        bookmarks: [],
      })

      const updatedUser = await user.save()

      const newCategory =
        updatedUser.categories[updatedUser.categories.length - 1]

      res.status(200).json({
        _id: newCategory._id,
        name: newCategory.name,
        isPrivate: newCategory.isPrivate,
        bookmarks: newCategory.bookmarks,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//GET  request || Read request
//returns a category based on the category name
router.get(
  '/:userID/categories/:categoryID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)
    const categories = user.categories

    const category = categories.find((p) => p._id == req.params.categoryID)

    if (category) {
      res.status(200).json(category)
    } else {
      res.status(404)
      throw new Error('Category not found')
    }
  })
)

// PUT request || Update request
// it is actually PUT requst, since we are updating an existing category in the already available user
// creates a new category of a certain user
router.put(
  '/:userID/categories/:categoryID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const category = user.categories.find(
        (p) => p._id == req.params.categoryID
      )

      if (category) {
        category.name = req.body.name
        category.isPrivate = req.body.isPrivate

        const updatedUser = await user.save()

        const updatedCategory = updatedUser.categories.find(
          (p) => p._id == req.params.categoryID
        )

        res.status(200).json({
          _id: updatedCategory._id,
          name: updatedCategory.name,
          isPrivate: updatedCategory.isPrivate,
          bookmarks: updatedCategory.bookmarks,
        })
      } else {
        res.status(404)
        throw new Error('Category not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//DELETE  request || Delete request
//deletes a category based on the category ID
router.delete(
  '/:userID/categories/:categoryID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const category = user.categories.find(
        (p) => p._id == req.params.categoryID
      )

      if (category) {
        var categoryIndex = user.categories.findIndex(
          (p) => p._id == req.params.categoryID
        )

        user.categories.splice(categoryIndex, 1)

        const updatedUser = await user.save()

        const updatedCategories = updatedUser.categories

        res.status(200).json(updatedCategories)
      } else {
        res.status(404)
        throw new Error('Category not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//CRUD for bookmarks

//GET  request
//returns all the bookmarks of a certain category
router.get(
  '/:userID/categories/:categoryID/bookmarks',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const categories = user.categories

      if (categories) {
        const category = user.categories.find(
          (p) => p._id == req.params.categoryID
        )

        if (category) {
          const bookmarks = category.bookmarks

          if (bookmarks) {
            res.status(200).json(bookmarks)
          } else {
            res.status(404)
            throw new Error('Bookmarks not found')
          }
        } else {
          res.status(404)
          throw new Error('Category not found')
        }
      } else {
        res.status(404)
        throw new Error('Categories not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

// POST request || Create request
// it is actually PUT requst, since we are creating a new bookmark in the already available user
// creates a new bookmark of a certain category of a certain user
router.put(
  '/:userID/categories/:categoryID/bookmarks/',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const categories = user.categories

      if (categories) {
        const category = user.categories.find(
          (p) => p._id == req.params.categoryID
        )

        var categoryIndex = user.categories.findIndex(
          (p) => p._id == req.params.categoryID
        )

        if (category) {
          const bookmarks = category.bookmarks

          if (bookmarks) {
            bookmarks.push({
              name: req.body.name,
              link: req.body.link,
            })

            const updatedUser = await user.save()
            const updatedBookmark =
              updatedUser.categories[categoryIndex].bookmarks[
                bookmarks.length - 1
              ]

            if (updatedBookmark) {
              res.status(200).json(updatedBookmark)
            } else {
              res.status(404)
              throw new Error('Bookmark not created')
            }
          } else {
            res.status(404)
            throw new Error('Bookmarks not found')
          }
        } else {
          res.status(404)
          throw new Error('Category not found')
        }
      } else {
        res.status(404)
        throw new Error('Categories not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//GET  request || Read request
//returns a bookmark based on the bookmark id
router.get(
  '/:userID/categories/:categoryID/bookmarks/:bookmarkID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const categories = user.categories

      if (categories) {
        const category = user.categories.find(
          (p) => p._id == req.params.categoryID
        )

        if (category) {
          const bookmarks = category.bookmarks

          if (bookmarks) {
            const bookmark = bookmarks.find(
              (p) => p._id == req.params.bookmarkID
            )

            if (bookmark) {
              res.status(200).json(bookmark)
            } else {
              res.status(404)
              throw new Error('Bookmark not found')
            }
          } else {
            res.status(404)
            throw new Error('Bookmarks not found')
          }
        } else {
          res.status(404)
          throw new Error('Category not found')
        }
      } else {
        res.status(404)
        throw new Error('Categories not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

// PUT request || Update request
// it is actually PUT requst, since we are updating an existing bookmark in the already available user
// updates an existing bookmark of a certain category of a certain user
router.put(
  '/:userID/categories/:categoryID/bookmarks/:bookmarkID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const categories = user.categories

      if (categories) {
        const category = user.categories.find(
          (p) => p._id == req.params.categoryID
        )

        var categoryIndex = user.categories.findIndex(
          (p) => p._id == req.params.categoryID
        )

        if (category) {
          const bookmarks = category.bookmarks

          if (bookmarks) {
            var bookmarkIndex = user.categories[
              categoryIndex
            ].bookmarks.findIndex((p) => p._id == req.params.bookmarkID)

            const bookmark = bookmarks[bookmarkIndex]

            if (bookmark) {
              bookmark.name = req.body.name
              bookmark.link = req.body.link

              const updatedUser = await user.save()
              const updatedBookmark =
                updatedUser.categories[categoryIndex].bookmarks[bookmarkIndex]

              if (updatedBookmark) {
                res.status(200).json({
                  _id: updatedBookmark._id,
                  name: updatedBookmark.name,
                  link: updatedBookmark.link,
                })
              } else {
                res.status(404)
                throw new Error('Bookmark not updated')
              }
            } else {
              res.status(404)
              throw new Error('Bookmark not found')
            }
          } else {
            res.status(404)
            throw new Error('Bookmarks not found')
          }
        } else {
          res.status(404)
          throw new Error('Category not found')
        }
      } else {
        res.status(404)
        throw new Error('Categories not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

//DELETE  request || Delete request
//deletes a bookmark based on the bookmark ID
router.delete(
  '/:userID/categories/:categoryID/bookmarks/:bookmarkID',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userID)

    if (user) {
      const categories = user.categories

      if (categories) {
        const category = user.categories.find(
          (p) => p._id == req.params.categoryID
        )

        var categoryIndex = user.categories.findIndex(
          (p) => p._id == req.params.categoryID
        )

        if (category) {
          const bookmarks = category.bookmarks

          if (bookmarks) {
            var bookmarkIndex = user.categories[
              categoryIndex
            ].bookmarks.findIndex((p) => p._id == req.params.bookmarkID)

            const bookmark = bookmarks[bookmarkIndex]

            if (bookmark) {
              user.categories[categoryIndex].bookmarks.splice(bookmarkIndex, 1)

              const updatedUser = await user.save()

              const updatedBookmarks =
                updatedUser.categories[categoryIndex].bookmarks

              if (updatedBookmarks) {
                res.status(200).json(updatedBookmarks)
              } else {
                res.status(404)
                throw new Error('Bookmark not deleted')
              }
            } else {
              res.status(404)
              throw new Error('Bookmark not found')
            }
          } else {
            res.status(404)
            throw new Error('Bookmarks not found')
          }
        } else {
          res.status(404)
          throw new Error('Category not found')
        }
      } else {
        res.status(404)
        throw new Error('Categories not found')
      }
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
)

export default router
