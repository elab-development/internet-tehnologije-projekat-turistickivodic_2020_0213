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
        return[
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'description' => $this->resource->description,
            'user' => $this->resource->user,
            'is_approved' => $this->resource->is_approved
        ];
    }
}
