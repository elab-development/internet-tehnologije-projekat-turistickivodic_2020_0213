<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;


class RouteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    public static $wrap = 'route';

    public function toArray($request)
    {
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'user' => $this->user,
            'locations' => $this->whenLoaded('locations'), // Include locations if they are loaded
        ];
    }
}
