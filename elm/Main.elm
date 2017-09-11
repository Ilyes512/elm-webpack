module Main exposing (..)

import Html exposing (text, div, button)
import Html.Attributes exposing (class)


main : Html.Html msg
main =
    div []
        [ text "Hello, World!"
        , button [ class "button" ] [ text "test" ]
        ]
